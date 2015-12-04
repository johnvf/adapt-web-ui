var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _charts = {};
var _loading = true;

var ChartStore = assign({}, EventEmitter.prototype, {

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
  getCharts: function(key){    
    return _charts[key]
  },

  isLoaded: function(){
    return !_loading
  }

});

ChartStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_CHARTS":
      action.charts.forEach( function(chart){
        chart.tags.forEach( function(tag){
          !_charts[tag] ? _charts[tag] = [chart] : _charts[tag].push(chart)
        })
        _charts[chart.slug] = chart // FIXME: Need a separate datastructure by name?
      })
      console.log(_charts)
      _loading = false
      ChartStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getCharts();
module.exports = ChartStore;