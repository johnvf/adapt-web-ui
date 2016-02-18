/**
 * Module for interacting with google drive
 *
 * Requires service account key from https://console.developers.google.com
 * Assumes a single config.yaml in a folder shared with this service account
 * @module api/modules/drive-client
 */
 
var fs=require('fs'),
    https=require('https'),
    mkdirp=require('mkdirp'),
    request = require('request');


var google = require('googleapis');
    spreadsheets = require("google-spreadsheets"),
    Promise = require('promise');

var request = require('request');

var chartPreprocessor = require('./chart-preprocessor');

var private_key,
    key,
    scopes,
    jwtClient,
    drive;

/*
 * Private
 */

/**
 * Returns a promise that Auths with the Google Drive API
 */
function auth( ){
    return new Promise( function(resolve,reject){

        // Regexes to swap badly escaped newlines + unicode '=' from the key
        private_key = process.env['GAPI_PRIVATE_KEY'].replace(/\\n/g, '\n').replace(/\\u003d/g, "=");

        key = {
          private_key_id:  process.env['GAPI_PRIVATE_KEY_ID'],
          private_key: private_key,
          client_email:  process.env['GAPI_CLIENT_EMAIL'],
          client_id:  process.env['GAPI_CLIENT_ID'],
          type:  process.env['GAPI_TYPE']
        };

        scopes = ['https://www.googleapis.com/auth/drive'];

        jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scopes , null);
        drive = google.drive({ version: 'v2', auth: jwtClient });

        jwtClient.authorize(function(err, tokens) {
            if (err){ reject(err);};
            console.log("Authed with Google Drive API ...")
            resolve( );        
        });
    })
}

/**
 * @param {Object} items - An array of Google Sheet items from Drive to load
 *   Returns a promise that loads data from a Google Sheet
 */
function getDriveSheetData( items ){
    return new Promise( function(resolve,reject){
        
        var itemPromises = items.map( function(item){
            return new Promise( function(resolveItem, rejectItem){

                spreadsheets({ key: item.key, auth: jwtClient }, function(err, spreadsheet) {
                    if (err){ console.log(err); resolveItem(item) };
                    if ( !spreadsheet ){
                        console.log("ERROR parsing sheet for: "+item.name+" - Unable to access: " +item.key);
                        resolveItem(item);
                    }
                    else{
                        spreadsheet.worksheets[parseInt(item.sheet)].cells({ range: item.range}, function(err, data) {
                            if (err){ rejectItem(err);};
                            if ( !data ){
                                console.error( "ERROR: No cell data for item: ");
                                console.error( JSON.stringify(item, undefined, 2));
                                resolveItem(item)
                            }
                            else{
                                var cell_data = chartPreprocessor.processGoogleSheet( data )
                                item.data = cell_data
                                resolveItem(item)
                            }
                        });
                    }
                });

            });
        })
        Promise.all(itemPromises).then( resolve );

    });
}

/**
 * @param {string} folderId - ID of the folder to download
 * @param {string} targetFolder - the destination filepath for the download
 */
function downloadFolderContents( folderId , targetFolder ){
    return new Promise( function(resolve,reject){

        mkdirp( targetFolder, function (err) {
            if (err) console.error(err)

            drive.children.list({ 'folderId': folderId}, function(err, resp){ 
                resp.items.forEach(function(itemMetadata){
                    drive.files.get({ 'fileId': itemMetadata.id}, function(err, item){
                        if( item ){
                            var fileName =  targetFolder + '/'+item.title
                            // Only downloads image files if they don't exist. 
                            // The user will have to delete images if any are changed
                            // Possible Fix: Compare download date to modifed date on google drive?
                            if (!fs.existsSync(fileName)){
                                var headers = { authorization: 'Bearer ' + jwtClient.credentials.access_token }

                                request.get({ url: item.downloadUrl, encoding: null,  headers: headers}, function done (err, res) {
                                    fs.writeFile( targetFolder + '/'+item.title, res.body, function (err) {
                                        console.log(err)
                                    })
                                })
                            }
                            else{
                                console.log( fileName + " already exists, skipped download");
                            }
                        }   
                    }) 
                })
                // FIXME: Google Drive rejects requests if they come too fast. 
                // Convert file downloads to a promise chain, THEN resolve the overall promise with URLs to files
                // resolve( resp )
            });

        });
    })
}

/*
 * Public
 */

/**
 * loads one or more google sheets
 */
function getSheetData( items, callback ){
    auth()
    .then( getDriveSheetData.bind( null, items ))
    .then( callback )
    .catch( function(err){
        console.error(err);
        throw "Problem getting" + JSON.stringify( item, null, 2)
    })
}

/**
 * Downloads a google drive folder - WIP
 */
function downloadFolder( folderId, targetFolder, callback ){
    auth()
    .then( downloadFolderContents.bind( null, folderId, targetFolder ))
    .then( callback )
    .catch( function(err){
        console.error(err);
        throw "Problem getting images"
    }) 
}

if (!module.parent) {
    require('dotenv').load();
    var imageFolderId = "0B-VKAjgnrgXwWTk5QUF2Q3Y1VVk"
    downloadFolder( imageFolderId , './public/img', function(items){ 
        // Callback to do something with file URLs would happen here.
    });
}

module.exports = { 
    getSheetData: getSheetData,
    downloadFolder: downloadFolder
}