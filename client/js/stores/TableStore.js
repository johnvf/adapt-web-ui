var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _tables = {};
var _loading = true;

var TableStore = assign({}, EventEmitter.prototype, {

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
  getTables: function(key){    
    return _tables[key]
  },

  isLoaded: function(){
    return !_loading
  }

});

TableStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_TABLES":
      action.tables.forEach( function(table){
        table.tags.forEach( function(tag){
          !_tables[tag] ? _tables[tag] = [table] : _tables[tag].push(table)
        })
        _tables[table.slug] = table // FIXME: Need a separate datastructure by ID?
      })
      console.log(_tables)
      _loading = false
      TableStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getTables();
module.exports = TableStore;