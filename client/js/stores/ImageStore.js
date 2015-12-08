var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var WebAPIUtils = require('../utils/WebAPIUtils');

var CHANGE_EVENT = 'change';

var _images = {};
var _loading = true;

var ImageStore = assign({}, EventEmitter.prototype, {

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
  getImages: function(key){    
    return _images[key]
  },

  isLoaded: function(){
    return !_loading
  }

});

ImageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "RECEIVE_IMAGES":
      action.images.forEach( function(image){
        image.tags.forEach( function(tag){
          !_images[tag] ? _images[tag] = [image] : _images[tag].push(image)
        })
        _images[image.slug] = image // FIXME: Need a separate datastructure by ID?
      })
      console.log(_images)
      _loading = false
      ImageStore.emitChange();
      break;


    default:
      // do nothing
  }

});

WebAPIUtils.getImages();
module.exports = ImageStore;