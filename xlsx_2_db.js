var fs=require('fs'),
    seeder = require('mongoose-seed'),
    XLSX = require('xlsx'),
    mammoth = require("mammoth"),
    driveClient = require("./api/modules/drive-client"),
    cloudinary = require('cloudinary');

// FIXME: Need to replace FRICKLE boiler plate ENV configuration with 'dotenv' + .env file
require('dotenv').load();
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./api/config');

var models = ['tag', 'chart', 'table', 'plantList', 'citation', 'caseStudy', 'text', 'image', 'map']

// Call this script with a path to an xlsx file.
var path = process.argv.slice(2)[0]
var root = path.split("/").slice(0,-1).join("/")

function slugify(s){
    return s.toLowerCase().replace(/ /g,'_').replace(/[^\w-]+/g,'');
}

function deslugify(s){
    return s.split("_").map( function(string){ return string.charAt(0).toUpperCase() + string.slice(1); }).join(" ")
}

// Dumps items in main spreadsheet, skips incomplete entries
function dump_data( worksheet, required_fields ){
    var dump = XLSX.utils.sheet_to_json( worksheet )

    var validData = [];
    var i = 0;

    dump.forEach(function( item ){
        var valid = true
        // Discard invalid documents using required_fields
        required_fields.forEach( function(key){
            if( !item[key] ){
                valid = false
            }
        })

        if( valid ){
            item.index = i
            i++
            validData.push( item )
        }

    })
    return validData
}

// Tags go straight in
function make_tags( dump ){
    seed_db( "tag", dump )
}

// .XLSX table data w/ c3.js configuration
//
// Use the existing google sheets API code to read the data directly
function make_charts( dump ){
    // Tack on c3 config info
    // Then load data from google drive + seed database
    driveClient.getSheetData( dump.map(function(item){

        var filepath = root + item["c3 config path"]
            item.config = JSON.parse( fs.readFileSync( filepath ) );
            item.tags = get_tags(item.tags)
            item.slug = slugify(item.name)
        return item
    }), 
    function(documents){
        seed_db( "chart", documents ) 
    });
}

// .XLSX table data - see make_charts for more info
function make_tables( dump ){
    // Load data from google drive + seed database
    driveClient.getSheetData( dump.map(function(item){
        item.tags = get_tags(item.tags)
        item.slug = slugify(item.name)
        return item
    }), 
    function(documents){
        // console.log(documents)
        seed_db( "table", documents ) 
    });   
}

// .XLSX table data - see make_charts for more info
function make_plant_lists( dump ){
    // Load data from google drive + seed database
    driveClient.getSheetData( dump.map(function(item){
        item.tags = get_tags(item.tags)
        item.slug = slugify(item.name)
        return item
    }), 
    function(documents){
        // console.log(documents)
        seed_db( "plantList", documents ) 
    });   
}

// .XLSX table data - see make_charts for more info
function make_citations( dump ){
    // Load data from google drive + seed database
    driveClient.getSheetData( dump.map(function(item){
        item.tags = get_tags(item.tags)
        item.slug = slugify(item.name)
        return item
    }), 
    function(documents){
        // console.log(documents)
        seed_db( "citation", documents ) 
    });   
}

// .XLSX table data - see make_charts for more info
function make_case_studies( dump ){
    // Load data from google drive + seed database
    driveClient.getSheetData( dump.map(function(item){
        item.tags = get_tags(item.tags)
        item.slug = slugify(item.name)
        return item
    }), 
    function(documents){
        // console.log(documents)
        seed_db( "caseStudy", documents ) 
    });   
}

function transformDocElement(element) {
    if ( element.id ) {
        element.id = "";
    }
    return element;
}

// Report text from .docx to Markdown or HTML
// Mammoth is async, so promises are used here
function make_text( dump ){

    var documents = []

    text_promises = dump.map( function( item ){
        return new Promise( function(resolve, reject){
            var filepath = root + item.path

            var options = {
                path: filepath,
                transformDocument: transformDocElement
            };

            mammoth.convertToMarkdown({ path: filepath }, options)            
            .then(function(result){
                // var data = result.value.replace(/id=.*"/g, "").replace(/~/g, "#"); // The generated HTML, with ids regexed out
                var data = result.value.replace(/id=.*"/g, "").replace(/http:\/\/www.adaptoakland.org/g, "").replace(/~/g, "#");
                var name = item.name
                var tags = get_tags(item.tags)
                resolve( { name: name, data: data, tags: tags, index: item.index } )
            })
            .catch(function(err) {
                // log that I have an error, return the entire array;
                console.error('ERROR: Failed to import '+filepath);
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

// Programmatically upload images,
// store URL in DB w/ name + tags
function make_images( dump ){

    // A hash of existing images
    var exImages = {}

    cloudinary.api.resources(function(result, err) { 
        if(!result.resources){ 
            console.error("ERROR: Unable to load images from cloudinary"); 
            return;
        }
        // Assemble a hash of existing resources by public_id.
        result.resources.forEach( function(resource){
            exImages[resource.public_id] = resource
        })

        // Filter out images that are already uploaded
        var newImages = dump.filter(function(item){ 
            var public_id = item.path.split("/").reverse()[0].split(".")[0]
            return exImages[public_id] === undefined 
        });

        // Get an array of promises to upload the new images
        var newImagePromises = newImages.map( function( item ){
            return new Promise( function(resolve, reject){
                var filepath = root + item.path
                
                var public_id = item.path.split("/").reverse()[0].split(".")[0]
                console.log("uploading: " + public_id)
                cloudinary.uploader.upload( filepath, function(result) {
                    resolve(result)
                }, { public_id: public_id })
            });
        })

        // Upload all new images, then combine new and old image data and seed db
        Promise.all( newImagePromises ).then(function(results) {
            console.log("done uploading")

            // Add the newly uploaded images to the existing images hash
            results.map( function(resource){ exImages[resource.public_id] = resource});

            // FIXME: Cloudinary supports tags, but I'm tacking ours on after upload. This could be confusing
            var documents = dump.map( function(item){ 
                var public_id = item.path.split("/").reverse()[0].split(".")[0]
                exImage = exImages[public_id]
                exImage.name = item.name
                exImage.slug = slugify(item.name)
                exImage.tags = get_tags(item.tags)
                exImage.index = item.index
                return exImage
            })

            seed_db( "image", documents )
        })

    });
}

// Map JSON for mapbox.gl
function make_maps( dump ){

    var documents = []

    dump.forEach( function( item ){
        var map;
        var tags = get_tags(item.tags);

        if( item.path ){
            var filepath = root + item.path
            map = JSON.parse( fs.readFileSync( filepath ) );
            map = lint_map( map );
        }
        else{
            map = { 
                name: deslugify( tags[tags.length-1] )
            }
        }

        map.tags = tags
        map.index = item.index;
        map.default = item.default
        map.heading = item.heading
        documents.push(map)
    });
    seed_db( "map", documents )
}

function lint_map( map ){
    map.layers.forEach( function(layer){
        if( !layer.type ){
            // Layers need a type or Mapbox errors out.
            layer["type"] = "line"
        }
    })
    return map
}

// Split and clean up tags
function get_tags( tagString ){
    return tagString.split(",").map( function(tag){ return tag.trim()})
}

// Iterate over Workbook sheets, import data to MongoDB
function seed_from_xlsx( path ){
    console.log("Dumping XLSX");
    var data = []

    var workbook = XLSX.readFile( path );

    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(sheet_name) { /* iterate through sheets */
        try {

            var worksheet = workbook.Sheets[sheet_name]
                sheetdata = {};

            switch(sheet_name) {

                case "Tags":
                    var required_fields = ["text", "type"] 
                    make_tags( dump_data( worksheet, required_fields ) )
                    break;

                case "Chart":
                    var required_fields = ["name", "c3 config path", "key", "sheet", "range", "tags"] 
                    make_charts( dump_data( worksheet, required_fields ) )
                    break;

                case "Table":
                    var required_fields = ["name", "key", "sheet", "range", "tags"]
                    make_tables( dump_data( worksheet, required_fields ) )
                    break;

                case "Plant List":
                    var required_fields = ["name", "key", "sheet", "range", "tags"]
                    make_plant_lists( dump_data( worksheet, required_fields ) )
                    break;

                case "Citation":
                    var required_fields = ["name", "key", "sheet", "range", "tags"]
                    make_citations( dump_data( worksheet, required_fields ) )
                    break;

                case "Case Study":
                    var required_fields = ["name", "key", "sheet", "range", "tags"]
                    make_case_studies( dump_data( worksheet, required_fields ) )
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
                    var required_fields = ["tags"] 
                    make_maps( dump_data( worksheet, required_fields ) )
                    break;

                default:
                    // Do nothing
            };

        }
        catch(err){
            console.log( err)
        }
    });
}

// Opens a connection to mongo, dumps the database, loads models
function dump_db( callback ){
    console.log("Dump DB");

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

// Loads data for a specific model into the db
// Seeder is available since it was defined in dump_db
function seed_db( model, documents ){
    console.log("Seeding "+model);

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

// Dump the database and reload all the data
dump_db( seed_from_xlsx.bind(null, path ) );