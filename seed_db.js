var fs=require('fs');
var seeder = require('mongoose-seed');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./api/config');

var models = ['asset', 'map', 'mapstyle', 'tabular', 'tag', 'text', 'user']

function load_data( callback ){
    
    var dir='./seeds/';
    var data=[];

    models.forEach( function(model){ 
        fs.readFile( './seeds/'+model+".json" , 'utf8', function( err, modelSeeds ){
            if (err) throw err;
            data.push( JSON.parse(modelSeeds) )
        });
    })

    callback( data );
}

function seed_db( data ){
   // Connect to MongoDB via Mongoose 
    seeder.connect( config.db, function() {
        
        // Load Mongoose models 
        var modelFiles = models.map( function(model){ return './api/models/'+model+".js" })
        seeder.loadModels( modelFiles )
     
        // Clear specified collections 
        seeder.clearModels( models , function() {
            
            console.log(JSON.stringify(data))
            // Callback to populate DB once collections have been cleared 
            seeder.populateModels(data);
        });
    }); 
}

load_data( seed_db );