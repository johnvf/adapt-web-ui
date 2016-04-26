var _ = require("lodash");
var mapboxgl = require('mapbox-gl');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _maps = {};
var _loading = true;
var _activeLayers = [];
var _activeGroup;
var _activeLayer;
var _currentBasemap = 'streets';

function handleURLChange(url){
  var urlParts = url.split("/"),
    tag = urlParts[ urlParts.length - 1]

  var layers = _maps[tag];

  if( !!layers ){

    _activeLayers.forEach(function(layer){
      layer.is_displayed = false;
    });

    var layers = layers.filter(function(layer){
      // check if layer should be displayed by default
      if( layer.default == 1 ){
        layer.is_displayed = true;
        return true;
      } else {
        layer.is_displayed = false;
        return false;
      }
    });

    console.log("setting new active layers", layers);
    _activeLayers = layers;
  }
}

var MapStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getMaps: function( tag ){
    return _maps[tag]
  },

  getCurrentBasemap: function(){
    return _currentBasemap;
  },

  getActiveLayers: function(){
    return _activeLayers;
  },

  isLoaded: function(){
    return !_loading
  }

});

MapStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    case "URL_CHANGED":
      handleURLChange(action.url)
      MapStore.emitChange();
      break;

    case "RECEIVE_MAPS":
      action.map_list.forEach( function(map){
        map.tags.forEach( function(tag){
          !_maps[tag] ? _maps[tag] = [map] : _maps[tag].push(map)
        })
      })
      _loading = false
      handleURLChange(window.location.pathname)
      MapStore.emitChange();
      break;

    case "TOGGLE_LAYER_MAP_DISPLAY":
      // check if the layer is in the active map layer set
      var matchIndex = _.findIndex(_activeLayers, function(activeLayer){
        return activeLayer.name === action.layer.text;
      });

      if( matchIndex > -1 ){
        action.layer.map_item.is_displayed = false;
        _activeLayers.splice( matchIndex, 1 );
      } else {
        action.layer.map_item.is_displayed = true;
        _activeLayers.push( action.layer.map_item );
      }
      MapStore.emitChange();
      break;

    case "CHANGE_BASEMAP":
      var key = action.basemapKey;
      console.log("changing basemap to", key);
      _currentBasemap = key;
      MapStore.emitChange();
      break

    case "GROUP_CLICKED":
      // If we want to change map state on that event, we could so here
      break;

    default:
      // do nothing
  }

});

WebAPIUtils.getMaps();
module.exports = MapStore;
