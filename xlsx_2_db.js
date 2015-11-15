var fs=require('fs'),
    seeder = require('mongoose-seed'),
    XLSX = require('xlsx');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./api/config');

// var models = ['asset', 'map', 'mapstyle', 'tabular', 'tag', 'text', 'user']
var models = ['map', 'mapstyle']

// Call this script with a path to an xlsx file.
var path = process.argv.slice(2)[0]

function dump_xlsx( path, callback ){
    console.log("dump_xlsx");
    var data = []

    var workbook = XLSX.readFile( path );

    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(sheet_name) { /* iterate through sheets */

        var worksheet = workbook.Sheets[sheet_name]
            sheetdata = {};

        switch(sheet_name) {

            case "Tags":
                // Dump tags
                break;

            case "Content":
                // Dump content
                break;

            case "Shapefiles":
                var required_fields = ["map_layer_name", "mapbox_id", "style_name", "tags"] 
                sheetdata.model = "map" 
                sheetdata.documents = dump_documents( worksheet, required_fields )
                break;

            case "Mapstyles":
                // var required_fields = ["style_name", "path"] 
                // sheetdata.model = "mapstyle" 
                // sheetdata.documents = load_mapstyles( dump_documents( worksheet, required_fields ) )
                break;

            default:
                // Do nothing
        }

        if( Object.keys(sheetdata).length > 0 ){
            data.push( sheetdata );
        }
    });

    callback( data );
}

function dump_documents( worksheet, required_fields ){
    var documents = XLSX.utils.sheet_to_json( worksheet )
    // Discard invalid documents
    var invalid_documents = [];
    documents.forEach(function(){

    })
    // console.log( JSON.stringify(documents, undefined, 2) );
    return documents
}

function seed_db( data ){
    console.log("seed_db");
   // Connect to MongoDB via Mongoose 
    seeder.connect( config.db, function() {
        
        // Load Mongoose models 
        var modelFiles = models.map( function(model){ return './api/models/'+model+".js" })
        seeder.loadModels( modelFiles )
     
        // Clear specified collections 
        seeder.clearModels( models , function() {
            
            console.log(JSON.stringify(data, null, 2))
            // Callback to populate DB once collections have been cleared 
            seeder.populateModels(data);
        });
    }); 
}

if (!module.parent) {
    console.log(path)
    dump_xlsx(path,  seed_db )
} else {
    // EXPORT SOME METHODS
}

// load_data( seed_db );
