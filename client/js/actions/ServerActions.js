var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  receiveMaps: function( maps ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_MAPS",
      maps: maps
    });
  }

};