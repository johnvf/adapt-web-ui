var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _projects;

var _reports = {};
var _reportLayouts = {};

var ProjectStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  getProjects: function(){
    if( _projects ){
      console.log("projects already loaded, using")
      return _projects;
    }
    else{
      console.log("projects not loaded, getting from server")
      WebAPIUtils.getProjects( )
    }
    
  },

  getReport: function( project_id, report_id ){
    if( _reports[report_id]){
      console.log("report already loaded, using")
      return _reports[ report_id ];
    }
    else{
      console.log("report not loaded, getting from server")
      WebAPIUtils.getReport(project_id , report_id)
    }
  },

  getReportLayouts: function( project_id, report_id ){
    if( _reportLayouts[ report_id ] ){
      return _reportLayouts[ report_id ];
    }
    else{
      WebAPIUtils.getReportLayouts(project_id , report_id)
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