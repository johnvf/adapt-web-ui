var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");


var CHANGE_EVENT = 'change';

var _title;
var _icon;

var _titlesIcons = {
  "adapt" : {
    icon: "icon-icon_logo",
    title: "Home"
  },
  "toolbox" : {
    icon: "icon-icon_toolbox",
    title: "Toolbox"
  },
  "oakland" : {
    icon: "icon-icon_map",
    title: "Adapt Oakland"
  },
  "about" : {
    icon: "icon-icon_about",
    title: "About"
  }
}

function updateIconAndTitle( url ){
  // Determine title and icon by looking up url
  var key = url.split("#")[0].split("/")[2] || 'adapt'

  _title = _titlesIcons[key] ? _titlesIcons[key].title : "Adapt"
  _icon = _titlesIcons[key] ? _titlesIcons[key].icon : "icon-icon_logo" 
}

var TitleStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getTitle: function(){
    return _title
  },

  getIcon: function(){
    return _icon
  },

});

TitleStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "URL_CHANGED":
      updateIconAndTitle(action.url);
      TitleStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = TitleStore;