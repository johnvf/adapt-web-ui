var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _text;
var _loading = false;

var TextStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getText: function( tags ){

    if( _loading === false && _text === null ){
      WebAPIUtils.getText( tags )
      _loading = true;
    }
    
    return _text
  },

  isLoaded: function(){
    return !_loading
  }

});

TextStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "URL_CHANGED":
      _text = null;
      TextStore.emitChange();
      break;

    case "RECEIVE_TEXT":
      _text = action.text
      _loading = false
      TextStore.emitChange();
      break;


    default:
      // do nothing
  }

});

module.exports = TextStore;