var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _caseStudies = {};
var _loading = true;

var CaseStudyStore = assign({}, EventEmitter.prototype, {

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
  getCaseStudies: function(key){    
    return _caseStudies[key]
  },

  isLoaded: function(){
    return !_loading
  }

});

CaseStudyStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_CASE_STUDIES":
      action.caseStudies.forEach( function(table){
        table.tags.forEach( function(tag){
          !_caseStudies[tag] ? _caseStudies[tag] = [table] : _caseStudies[tag].push(table)
        })
        _caseStudies[table.slug] = table // FIXME: Need a separate datastructure by ID?
      })
      console.log(_caseStudies)
      _loading = false
      CaseStudyStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getCaseStudies();
module.exports = CaseStudyStore;