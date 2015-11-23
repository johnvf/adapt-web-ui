var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  getMaps: function( tags ) {
    AppDispatcher.handleViewAction({
      type: "GET_MAPS",
      tags: tags
    });
  },

  urlChanged: function( url ) {
    AppDispatcher.handleViewAction({
      type: "URL_CHANGED",
      url: url
    });
  },

  toggleTags: function( tags ) {
    AppDispatcher.handleViewAction({
      type: "TOGGLE_TAGS",
      tags: tags
    });
  },

  activateTags: function(tags){
    AppDispatcher.handleViewAction({
      type: "ACTIVATE_TAGS",
      tags: tags
    });
  }

}