var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _text = {};
var _loading = true;

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

  getText: function(tag){    
    return _text[tag]
  },

  isLoaded: function(){
    return !_loading
  }

});

TextStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_TEXT":
      action.text.forEach( function(text){
        text.tags.forEach( function(tag){
          !_text[tag] ? _text[tag] = [text] : _text[tag].push(text)
        })
      })
      _loading = false
      TextStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getText();
module.exports = TextStore;