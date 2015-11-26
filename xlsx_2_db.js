var fs=require('fs'),
    seeder = require('mongoose-seed'),
    XLSX = require('xlsx'),
    mammoth = require("mammoth");

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./api/config');

// var models = ['asset', 'map', 'tabular', 'tag', 'text', 'user']
var models = ['tag', 'chart', 'table', 'text', 'image', 'map']

// Call this script with a path to an xlsx file.
var path = process.argv.slice(2)[0]
var root = path.split("/").slice(0,-1).join("/")

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

function make_tags( dump ){
    seed_db( "tag", dump )
}

function make_charts( dump ){

    var documents = []

    dump.forEach( function( item ){
    })

    // seed_db( "chart", documents )
}

function make_tables( dump ){

    var documents = []

    dump.forEach( function( item ){
    })

    // seed_db( "table", documents )
}

function make_text( dump ){

    var documents = []

    text_promises = dump.map( function( item ){
        return new Promise( function(resolve, reject){
            var filepath = root + item.path

            mammoth.convertToMarkdown({path: filepath})            
            .then(function(result){
                var data = result.value; // The generated HTML 
                var name = item.name
                var tags = get_tags(item.tags)
                resolve( { name: name, data: data, tags: tags } )
            })
            .catch(function(err) {
                // log that I have an error, return the entire array;
                console.log('Failed to import '+filepath);
                // console.log('A promise failed to resolve', err);
                resolve(undefined)
            })
        })
    })

    Promise.all( text_promises ).then(function(text_promises) {
        // full array of resolved promises;
        documents = text_promises.map( function(text){return text})
            .filter(function(n){ return n != undefined });

        seed_db( "text", documents )
    })
    
    
}

function make_images( dump ){

    var documents = []

    dump.forEach( function( item ){
    })

    // seed_db( "image", documents )
}

function make_maps( dump ){

    var documents = []

    dump.forEach( function( item ){

        var filepath = root + item.path
        // fs.readFile( filepath, function (err, data) {
        //     if (err) throw err;
        //     var map = JSON.parse(data)
        //     map.tags = get_tags(item.tags)
        //     documents.push(map)
        // });
        var map = JSON.parse( fs.readFileSync( filepath ) );
            map.tags = get_tags(item.tags)
            documents.push(map)
    });
    seed_db( "map", documents )
}

function get_tags( tagString ){
    return tagString.split(",").map( function(tag){ return tag.trim()})
}

function seed_from_xlsx( path ){
    console.log("dump_xlsx");
    var data = []

    var workbook = XLSX.readFile( path );

    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(sheet_name) { /* iterate through sheets */

        var worksheet = workbook.Sheets[sheet_name]
            sheetdata = {};

        switch(sheet_name) {

            case "Tags":
                var required_fields = ["text", "type"] 
                make_tags( dump_data( worksheet, required_fields ) )
                break;

            case "Chart":
                var required_fields = ["path", "tags"] 
                make_charts( dump_data( worksheet, required_fields ) )
                break;

            case "Table":
                var required_fields = ["path", "tags"] 
                make_tables( dump_data( worksheet, required_fields ) )
                break;

            case "Text":
                var required_fields = ["path", "tags"] 
                make_text( dump_data( worksheet, required_fields ) )
                break;

            case "Image":
                var required_fields = ["path", "tags"] 
                make_images( dump_data( worksheet, required_fields ) )
                break;

            case "Maps":
                var required_fields = ["path", "tags"] 
                make_maps( dump_data( worksheet, required_fields ) )
                break;

            default:
                // Do nothing
        }
    });
}

function dump_db( callback ){
    console.log("dump_db");

   // Connect to MongoDB via Mongoose 
    seeder.connect( config.db, function() {
        // Load Mongoose models 
        var modelFiles = models.map( function(model){ return './api/models/'+model+".js" })
        seeder.loadModels( modelFiles )
     
        // Clear specified collections 
        seeder.clearModels( models , function() {
            callback();
        });
    }); 
}

function seed_db( model, documents ){
    console.log("seeding "+model);

    // Format the data for the seeder
    var data = []

    var sheetdata = {}
        sheetdata.model = model
        sheetdata.documents = documents
        
    if( Object.keys(sheetdata).length > 0 ){
        data.push( sheetdata );
    }

    // Load Mongoose models 
    var modelFile = './api/models/'+model+".js"
    // seeder.loadModels( modelFile )

    seeder.populateModels(data);
}

dump_db( seed_from_xlsx.bind(null, path ) );