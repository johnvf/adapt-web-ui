var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _tools = {};
var _loading = true;

var ToolStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  // key can be a tag or slug
  getTools: function(key){    
    return _tools[key]
  },

  isLoaded: function(){
    return !_loading
  }

});

ToolStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_TOOLS":
      action.tools.forEach( function(tool){
        tool.tags.forEach( function(tag){
          !_tools[tag] ? _tools[tag] = [tool] : _tools[tag].push(tool)
        })
        _tools[tool.slug] = tool // FIXME: Need a separate datastructure by ID?
      })
      console.log("_tools", _tools)
      _loading = false
      ToolStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getTools();
module.exports = ToolStore;