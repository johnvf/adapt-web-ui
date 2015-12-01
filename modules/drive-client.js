/*
 * Module for interacting with google drive
 * Requires service account key from https://console.developers.google.com
 * Assumes a single config.yaml in a folder shared with this service account
 */

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

// Loads data from a spreadsheet
function getDriveSheetData( items ){
    return new Promise( function(resolve,reject){

        var itemPromises = items.map( function(item){
            return new Promise( function(resolve,reject){

                spreadsheets({ key: item.key, auth: jwtClient }, function(err, spreadsheet) {
                    if (err){ reject(err);};
                    spreadsheet.worksheets[parseInt(item.sheet)].cells({ range: item.range}, function(err, cells) {
                        if (err){ reject(err);};
                        var data = chartPreprocessor.processGoogleSheet( cells )
                        item.data = data
                        resolve(item)
                    });
                });

            });
        })
        new Promise.all(itemPromises).then( resolve )
    });
}

/*
 * Utils
 */



function log(){
    if(console){
        console.log.apply(console, arguments);
    }
}

function log_test(arg){
    console.log( JSON.stringify(arg, null, 2) )
}
/*
 * Public
 */

// TESTED - works
function test( ){
    console.log("Testing ...");
    require('dotenv').load();
    // console.log(process.env)
    
    var chart = {
        key: "1PPwXH9Yrr4ZlEkqXfPVjDuVK6wIctkE4ROdmL1xspP8",
        sheet: "0",
        range: "A1:I13"
    }
    auth()
    .then( getDriveSheetData.bind( null, [chart, chart, chart] ))
    .then( log )
    .catch( function(err){console.error(err);} )
}

function getSheetData( items, callback ){
    auth()
    .then( getDriveSheetData.bind( null, items ))
    .then( callback )
    .catch( function(err){
        console.error(err);
        throw "Problem getting" + JSON.stringify( item, null, 2)
    })
}

if (!module.parent) {
    test();
}

module.exports = { 
    getSheetData: getSheetData
}