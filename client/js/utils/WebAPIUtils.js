var request = require('superagent');
var ServerActions = require('../actions/ServerActions')

function handleError( errText ){

  switch(errText) {

    case "Some Specific Error":
      alert('FAIL!');
      break;

    default:
      alert('Oh no! error ' + errText);
      // do nothing
  }

}

module.exports = {

    getTags: function( ){
        // If tags, concatenate and append to URL
        request.get( "/api/tag?limit=1000" )
          .set('Accept', 'application/json')
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveTags(JSON.parse(res.text).payload);
          } else {
            handleError(res.text);
          }

        });
    },

    getMaps: function( tags ){
        // If tags, concatenate and append to URL
        var url = tags ?  "/api/map?filter[tags]="+tags : "/api/map"
        request.get( url )
          .set('Accept', 'application/json')
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveMaps(JSON.parse(res.text).payload);
          } else {
            handleError(res.text);
          }

        });
    },

    getText: function( tags ){
        // If tags, concatenate and append to URL
        var url = tags ?  "/api/text?filter[tags]="+tags : "/api/text"
        request.get( url )
          .set('Accept', 'application/json')
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveText(JSON.parse(res.text).payload); 
          } else {
            handleError(res.text);
          }

        });
    },

    getCharts: function( tags ){
        // If tags, concatenate and append to URL
        var url = tags ?  "/api/chart?filter[tags]="+tags : "/api/chart"
        request.get( url )
          .set('Accept', 'application/json')
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveCharts(JSON.parse(res.text).payload); 
          } else {
            handleError(res.text);
          }

        });
    },

    getTables: function( tags ){
        // If tags, concatenate and append to URL
        var url = tags ?  "/api/table?filter[tags]="+tags : "/api/table"
        request.get( url )
          .set('Accept', 'application/json')
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveTables(JSON.parse(res.text).payload); 
          } else {
            handleError(res.text);
          }

        });
    },

    getImages: function( tags ){
        // If tags, concatenate and append to URL
        var url = tags ?  "/api/image?filter[tags]="+tags : "/api/image"
        request.get( url )
          .set('Accept', 'application/json')
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveImages(JSON.parse(res.text).payload); 
          } else {
            handleError(res.text);
          }

        });
    }

};
