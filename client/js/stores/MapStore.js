var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _maps;

var ProjectStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  getMaps: function(){
    if( _maps ){
      return _maps;
    }
    else{
      WebAPIUtils.getMaps( )
      return _maps;
    }
    
  }

});

ProjectStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "LOG_OUT":
      _projects = null;
      _reports = {};
      ProjectStore.emitChange();
      break;

    case "RECEIVE_PROJECTS":
      _projects = action.projects
      ProjectStore.emitChange();
      break;


    case "RECEIVE_REPORT":
      _reports[ action.report_id ] = action.report
      ProjectStore.emitChange();
      break;

    case "RECEIVE_REPORT_LAYOUTS":
      _reportLayouts[ action.report_id ] = action.reportLayouts
      ProjectStore.emitChange();
      break;

    case "SAVE_REPORT_LAYOUTS":
      _reportLayouts[ action.report_id ] = action.reportLayouts
      ProjectStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = ProjectStore;