var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  receiveTags: function( tags ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_TAGS",
      tags: tags
    });
  },

  receiveMaps: function( map_list ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_MAPS",
      map_list: map_list
    });
  }

};