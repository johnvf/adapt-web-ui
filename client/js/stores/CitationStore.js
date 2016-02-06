var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _citations = {};
var _loading = true;

var CitationStore = assign({}, EventEmitter.prototype, {

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
  getCitations: function(key){    
    return _citations[key]
  },

  isLoaded: function(){
    return !_loading
  }

});

CitationStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_CITATIONS":
      action.citations.forEach( function(citation){
        citation.tags.forEach( function(tag){
          !_citations[tag] ? _citations[tag] = [citation] : _citations[tag].push(citation)
        })
        _citations[citation.slug] = citation // FIXME: Need a separate datastructure by ID?
      })
      console.log(_citations)
      _loading = false
      CitationStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getCitations();
module.exports = CitationStore;