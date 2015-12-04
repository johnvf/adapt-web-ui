var _ = require("lodash");
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _maps = {};
var _loading = true;
var _activeLayers = [];

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

    case "RECEIVE_MAPS":
      action.map_list.forEach( function(map){
        map.tags.forEach( function(tag){
          !_maps[tag] ? _maps[tag] = [map] : _maps[tag].push(map)
        })
      })
      _loading = false
      MapStore.emitChange();
      break;

    case "TOGGLE_MAP_LAYER":
      // check if the layer is in the active map layer set
      var matchIndex = _.findIndex(_activeLayers, function(activeLayer){
        return activeLayer.name === action.layer.text;
      });

      if( matchIndex > -1 ){
        action.layer.is_active = false;
        _activeLayers.splice( matchIndex, 1 );
      } else {
        action.layer.is_active = true;
        _activeLayers.push( action.layer.map_item );
      }
      MapStore.emitChange();
      break;

    default:
      // do nothing
  }

});

WebAPIUtils.getMaps();
module.exports = MapStore;
