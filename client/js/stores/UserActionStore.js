// UserActionStore.js


var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var CHANGE_EVENT = 'change';

var _hoveredFeatures = [];
var _mapEvent;

var UserActionStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getHoveredFeatures: function(){
    return _hoveredFeatures;
  },

  getMapEvent: function(){
    return _mapEvent;
  }

});


UserActionStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "FEATURE_HOVER":
      _hoveredFeatures = action.features;
      _mapEvent = action.e;
      UserActionStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = UserActionStore;
