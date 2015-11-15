var fs=require('fs'),
    seeder = require('mongoose-seed'),
    XLSX = require('xlsx');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./api/config');

// var models = ['asset', 'map', 'mapstyle', 'tabular', 'tag', 'text', 'user']
var models = ['map', 'mapstyle']

// Call this script with a path to an xlsx file.
var path = process.argv.slice(2)[0]
var root = path.split("/").slice(0,-2).join("/")

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
                sheetdata.documents = make_maps( dump_data( worksheet, required_fields ) )
                break;

            case "Mapstyles":
                var required_fields = ["style_name", "path"] 
                sheetdata.model = "mapstyle" 
                sheetdata.documents = make_mapstyles( dump_data( worksheet, required_fields ) )
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
    dump.forEach(function( item, index ){
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

    var maps = {}

    dump.forEach( function( layer ){
        if(!maps[layer.map_layer_name]){

            maps[layer.map_layer_name] = { 
                name: layer.map_layer_name,
                layers: [ 
                    {
                      source: layer.mapbox_id,
                      source_layer: layer.source_layer,
                      style: layer.style_name
                    }
                ],
                tags: get_tags(layer.tags)
            }
        }
        else{
            maps[layer.map_layer_name].layers.push({
                source: layer.mapbox_id,
                source_layer: layer.source_layer,
                style: layer.style_name
            });
        }
    });

    return Object.keys(maps).map( function(name){ return maps[name]})
}

function make_mapstyles( dump ){

    var mapstyles = []

    dump.forEach( function( style ){

        var styleFile = root + style.path

        fs.readFile( styleFile, function (err, data) {
            if (err) throw err;

            mapstyles.push({
                name: style.style_name,
                data: JSON.parse(data)
            });

        });



    });

    return mapstyles
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
            
            // console.log(JSON.stringify(data, null, 2))
            // Callback to populate DB once collections have been cleared 
            seeder.populateModels(data);
        });
    }); 
}

if (!module.parent) {
    // console.log(path)
    dump_xlsx(path,  seed_db )
} else {
    // EXPORT SOME METHODS
}

// load_data( seed_db );
