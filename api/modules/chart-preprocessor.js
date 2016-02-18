/**
 * Utilities for cleanup of google sheets data
 *
 * @module api/modules/chart-preprocessor
 */

function coerceNum( candidate ){
    if( typeof candidate === "string"){
        var num = parseFloat(candidate.replace(/[,$]+/g, ""))
        if( isNaN(num)){
            return candidate
        } else{
            return num
        }
    }
    else{
        return candidate
    }
}

function processGoogleSheet( data ){
    var cells = data.cells;
    // Convert nested cells into a nested array
    var array = Object.keys( cells ).map(function( row_i ){
        var row_data = Object.keys( cells[row_i] ).map(function( col_i ){

            var cell = cells[row_i][col_i]
            return coerceNum( cell["value"] )
        });

        return row_data
    });
    return array
}

module.exports = {
    processGoogleSheet: processGoogleSheet
}