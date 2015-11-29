var fs=require('fs'),
    seeder = require('mongoose-seed'),
    XLSX = require('xlsx');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./api/config');

// var models = ['asset', 'map', 'tabular', 'tag', 'text', 'user']
var models = ['map', 'tag']

// Call this script with a path to an xlsx file.
var path = process.argv.slice(2)[0]
var root = path.split("/").slice(0,-1).join("/")

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
                var required_fields = ["text", "type"]
                sheetdata.model = "tag"
                sheetdata.documents = dump_data( worksheet, required_fields )
                break;

            case "Content":
                // Dump content
                break;

            case "Maps":
                var required_fields = ["path", "tags"]
                sheetdata.model = "map"
                sheetdata.documents = make_maps( dump_data( worksheet, required_fields ) )
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

function dump_data( worksheet, required_fields ){
    var dump = XLSX.utils.sheet_to_json( worksheet )

    var validData = [];
    dump.forEach(function( item ){
        var valid = true
        // Discard invalid documents using required_fields
        required_fields.forEach( function(key){
            if( !item[key] ){
                valid = false
            }
        })

        if( valid ){
            validData.push( item )
        }

    })
    return validData
}

function make_maps( dump ){
    // reads map JSONs from the file system
    var maps = []
    dump.forEach( function( item ){
        var filepath = root + item.path
        fs.readFile( filepath, function (err, data) {
            if (err) throw err;
            var map = JSON.parse(data)
            map.tags = get_tags(item.tags)
            maps.push(map)
        });
    });

    return maps
}

function get_tags( tagString ){
    return tagString.split(",").map( function(tag){ return tag.trim()})
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
            // Callback to populate DB once collections have been cleared
            seeder.populateModels(data);
        });
    });
}

dump_xlsx(path,  seed_db )
