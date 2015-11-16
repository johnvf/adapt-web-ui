var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  receiveMaps: function( map_list ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_MAPS",
      map_list: map_list
    });
  }

};