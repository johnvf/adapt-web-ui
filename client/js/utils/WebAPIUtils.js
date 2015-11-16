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

    getMaps: function( tags ){
        // If tags, concatenate and append to URL
        request.get( "/api/map" )
          .set('Accept', 'application/json')
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveMaps(JSON.parse(res.text).payload); 
          } else {
            handleError(res.text);
          }

        });
    }

};