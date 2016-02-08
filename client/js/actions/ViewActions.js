var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  getMaps: function( tags ) {
    AppDispatcher.handleViewAction({
      type: "GET_MAPS",
      tags: tags
    });
  },

  layerClicked: function( layer ) {
    AppDispatcher.handleViewAction({
      type: "LAYER_CLICKED",
      layer: layer
    });
  },

  toggleLayerMapDisplay: function( layer ) {
    AppDispatcher.handleViewAction({
      type: "TOGGLE_LAYER_MAP_DISPLAY",
      layer: layer
    })
  },

  changeBasemapLayer: function( basemapKey ) {
    AppDispatcher.handleViewAction({
      type: "CHANGE_BASEMAP",
      basemapKey: basemapKey
    });
  },

  groupClicked: function( group ) {
    AppDispatcher.handleViewAction({
      type: "GROUP_CLICKED",
      group: group
    })
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
