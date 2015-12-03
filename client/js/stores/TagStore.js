var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");
var _ = require('lodash');

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _tags = {},
    _tagLookup = {},
    _active_tags = {},
    _mapTagTree = [],
    _URLTag;

window.onpopstate = function(event) {
  alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};

var TagStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  toggleTags: function(tagTextArray){
    tagTextArray.forEach(function(tagText){
      _active_tags[tagText] ? delete _active_tags[tagText] : _active_tags[tagText] = _tagLookup[tagText]
    })
  },

  activateTags: function(tagTextArray){
    tagTextArray.forEach(function(tagText){
      _active_tags[tagText] = _tagLookup[tagText]
    });
  },

  receiveTags: function(tags){
    // Categorize tags by type for UI,
    // hold onto a lookup of them for future reference.
    tags.forEach(function(tag){
      _tags[tag.type] ? _tags[tag.type].push(tag.text) : _tags[tag.type] = [tag.text]
      _tagLookup[tag.text] = tag
    });

    this.activateTags(_URLTag);
  },

  getTags: function(){
    return _tags
  },

  getActiveTags: function(){
    return _active_tags
  },

  getURLTag: function(){
    return _URLTag
  },

  getMapTagTree: function(){
    return _mapTagTree;
  }

});

TagStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "URL_CHANGED":
      // FIXME: Looks like only a single tag is supported by MERS filtering
      _URLTag = window.location.pathname.split("/").reverse()[0];
      TagStore.emitChange();
      break;

    case "TOGGLE_TAGS":
      TagStore.toggleTags( action.tags );
      TagStore.emitChange();
      break;

    case "ACTIVATE_TAGS":
      TagStore.activateTags( action.tags );
      TagStore.emitChange();
      break;

    case "RECEIVE_TAGS":
      TagStore.receiveTags( action.tags )
      console.debug(_tags)
      console.debug(_active_tags)
      TagStore.emitChange();
      break;

    case "RECEIVE_MAPS":
      var map_list = action.map_list;

      map_list.forEach( function(layer){

        var layerTags = layer.tags.map(function(tagText){ return _tagLookup[tagText]; });
        layerTags = layerTags.filter(function (t){ return t; });
        var mapTag = layerTags.filter(function(tag){ return tag.type == "map";})[0];
        var groupTag = layerTags.filter(function(tag){ return tag.type == "map_group";})[0];
        var layerTag = layerTags.filter(function(tag){ return tag.type == "map_layer";})[0];
        if( mapTag && groupTag && layerTag ){
          // add these items to the map tag tree structure
          var mapObject = _mapTagTree.filter(function(mapObj){ return mapObj.tag.text === mapTag.text; })[0];
          if( !mapObject ){
            mapObject = { text: mapTag.text, tag: mapTag, groups: [] };
            _mapTagTree.push(mapObject);
          }
          var groupObject = mapObject.groups.filter(function(g){return g.tag.text === groupTag.text; })[0];
          if( !groupObject ){
            groupObject = { text: groupTag.text, tag: groupTag, layers: [] };
            mapObject.groups.push(groupObject);
          }
          var layerObject = { text: layer.name, tag: layerTag, map_item: layer };
          groupObject.layers.push(layerObject);
        } else {
          console.log("insufficient tags:", layer.name, layer.tags);
        }
      });
      console.log("built mapTagTree", _mapTagTree);
      _loading = false
      TagStore.emitChange();
      break;

    default:
      // do nothing
  }

});

WebAPIUtils.getTags();
module.exports = TagStore;