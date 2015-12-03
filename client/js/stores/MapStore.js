var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _maps = {};
var _loading = true;

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


    default:
      // do nothing
  }

});

WebAPIUtils.getMaps();
module.exports = MapStore;