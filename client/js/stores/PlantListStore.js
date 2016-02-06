var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _plantLists = {};
var _loading = true;

var PlantListStore = assign({}, EventEmitter.prototype, {

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
  getPlantLists: function(key){    
    return _plantLists[key]
  },

  isLoaded: function(){
    return !_loading
  }

});

PlantListStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_PLANT_LISTS":
      action.plantLists.forEach( function(plantList){
        plantList.tags.forEach( function(tag){
          !_plantLists[tag] ? _plantLists[tag] = [plantList] : _plantLists[tag].push(plantList)
        })
        _plantLists[plantList.slug] = plantList // FIXME: Need a separate datastructure by ID?
      })
      console.log(_plantLists)
      _loading = false
      PlantListStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getPlantLists();
module.exports = PlantListStore;