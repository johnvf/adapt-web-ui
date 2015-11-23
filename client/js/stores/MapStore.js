var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _mapLookup = {};
var _map_list;
var _loading = false;

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

  getMaps: function( tags ){

    if( _loading === false && _map_list === null ){
      WebAPIUtils.getMaps( tags )
      _loading = true;
    }
    
    return _map_list
  },

  isLoaded: function(){
    return !_loading
  }

});

MapStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "URL_CHANGED":
      _map_list = null;
      MapStore.emitChange();
      break;

    case "RECEIVE_MAPS":
      _map_list = action.map_list
      _mapLookup[action.tags] = action.map_list
      _loading = false
      MapStore.emitChange();
      break;


    default:
      // do nothing
  }

});

module.exports = MapStore;