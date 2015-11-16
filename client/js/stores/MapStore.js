var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _map_list;
var _loading = true;

var ProjectStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  getMaps: function(){
    if( _map_list ){
      return _map_list;
    }
    else{
      WebAPIUtils.getMaps( )
      _loading = true;
      return _map_list
    }
    
  },

  isLoaded: function(){
    return !_loading
  }

});

ProjectStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_MAPS":
      _map_list = action.map_list
      _loading = false
      ProjectStore.emitChange();
      break;


    default:
      // do nothing
  }

});

module.exports = ProjectStore;