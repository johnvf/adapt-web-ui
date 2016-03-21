var React = require('react');

var mapboxgl = require('mapbox-gl');

var MouseActions = require("../actions/MouseActions");

var Tooltip = require('../components/MapTooltip');
var BasemapToggle = require('../components/BasemapToggle');
var Legend = require('../components/MapLegend');

// It seems that this value may vary in different devices 
// w/ different zoom settings
// Not crazy about changing a global like this, but
// this should standardize things a bit...
window.devicePixelRatio=1

// array.find polyfill
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

function styleId(layer, styleIndex){
  return layer._id + "_" + styleIndex;
}

function objInArrayHasId( array, id ){
  return array.find(function(o){
    return o.id === id
  })
}

var Map = React.createClass({

  getInitialState: function(){
    return { activeStyles: {}, activeSources: {}, currentBasemap: 'streets'};
  },

  componentDidMount: function(){
    var basemaps = {
      streets: 'mapbox://styles/mapbox/light-v8',
      satellite: 'mapbox://styles/mapbox/satellite-v8'
    };
    var map = this.makeMap(basemaps.streets);
    this.setState({ map: map, basemaps: basemaps});
    this.addEventListeners(map);
  },

  componentWillUnmount: function(){

  },

  switchBasemap: function(key, loadedCallback){
    if( key !== this.state.currentBasemap){
      var basemapStyle = this.state.basemaps[key];
      this.state.map.setStyle(basemapStyle);
      this.setState({ activeStyles: {}, activeSources: {}});
      this.state.map.style.on('load', loadedCallback);
      return true;
    } else {
      return false;
    }
  },

  componentWillReceiveProps: function(props){

    var updateLayers = function(){
      var results = this.batchUpdateLayers(props.active_layers);
      this.setState({activeStyles: results.styles, activeSources: results.sources, currentBasemap: props.basemap});
      this.resizeMap();
    }.bind(this);

    var switched = this.switchBasemap(props.basemap, updateLayers)
    if( !switched ){
      updateLayers();
    }

  },


  addEventListeners: function(map){
    map.on('mousemove', this.handleMouseMove.bind(null, map));
    window.onresize = this.resizeMap;
  },

  removeEventListeners: function(map){
    map.removeEventListener('mousemove', this.handleMouseMove);
    window.onresize = null;
  },

  handleMouseMove: function(map, e){
    map.featuresAt(e.point, {radius:5}, function( err, features ){
      if (err) throw err;
      MouseActions.featureHover(e, features);
    });
  },

  resizeMap: function(){
    var self = this;
    setTimeout( function() {
      if( self.state.map ){
        self.state.map.resize();
      }
    }, 200);
  },

  batchUpdateLayers: function (newLayers){
    var self = this,
        map = this.state.map,
        diff = this.diffMapLayers(newLayers);

    console.debug("DIFF ", diff)
    if( this.state.map ){

      map.batch(function(batch){

          diff.remove.styles.map( function(layer){

              try {
                batch.removeLayer( layer )
              }
              catch(err) {
                console.debug("Problem removing layer: ", layer)
                console.debug("Message: ", err.message)
              }

          }, batch);

          diff.remove.sources.map(function(source){

              try {
                batch.removeSource
              }
              catch(err) {
                console.debug("Problem removing source: ", source)
                console.debug("Message: ", err.message)
              }

          }, batch);

          diff.add.sources.map(function(s){
            try {
              batch.addSource(s.id, s.source);
            }
            catch(err) {
              console.debug("Problem adding source: ", s.source)
              console.debug("Message: ", err.message)
            }
          }, batch);

          diff.add.styles.map(function(style){
            try {
              batch.addLayer(style);
            }
            catch(err){
              console.debug("Problem adding layer: ", style)
              console.debug("Message: ", err.message)
            }
          }, batch);

      });

    }

    return diff;
  },

  diffMapLayers: function (layers){
    // returns two list: layers to remove and layers to add
    var addQueue = {sources:[], styles: []},
        removeQueue = {sources:[], styles: []},
        newStyles = {},
        newSources = {},
        activeStyles = this.state.activeStyles,
        activeSources = this.state.activeSources;

    layers.forEach(function(layer){
      for(source_id in layer.sources){
        newSources[source_id] = layer.sources[source_id];
        if(layer.sources.hasOwnProperty(source_id)){
          if(!activeSources.hasOwnProperty(source_id)){

            if( !objInArrayHasId( addQueue.sources, source_id) ){
              addQueue.sources.push({
                id: source_id,
                source: layer.sources[source_id]
              });
            }


          }
        }
      }
      layer.layers.forEach(function(style, i){
        var id = styleId(layer, i);
        newStyles[id] = style;
        if(!activeStyles.hasOwnProperty(id)){

          if( !objInArrayHasId( addQueue.styles, id) ){
            style.id = id;
            addQueue.styles.push(style);
          }
        }
      });
    });

    for(id in activeStyles){
      if(activeStyles.hasOwnProperty(id)){
        if(!newStyles.hasOwnProperty(id)){

          if( removeQueue.styles.indexOf(id) == -1){
            removeQueue.styles.push(id);
          }

        }
      }
    }
    for(key in activeSources){
      if(activeSources.hasOwnProperty(key)){
        if(!newSources.hasOwnProperty(key)){

          if( removeQueue.sources.indexOf(id) == -1){
            removeQueue.sources.push(id);
          }

        }
      }
    }

    return {add: addQueue, remove: removeQueue, styles: newStyles, sources: newSources};
  },


  makeMap: function(defaultStyle){

    mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5iaW9maWx0ZXJkZXYiLCJhIjoiY2lnenZwdnNzMHdibnc3bTVrOWYzc3JraCJ9.eOfaXgitCGm4aqppPt6oHw';
    var map;

    try {
      map = new mapboxgl.Map({
          container: 'map', // container id
          style: defaultStyle, // stylesheet location
          center: [ -122.3000, 37.8100], // starting position
          zoom: 12 // starting zoom
      });
    }
    catch(e){
      alert( "Unable to display map correctly in your browser. WebGL is needed. Please install Google Chrome and come back!")
    }

    return map;
  },

  render: function() {
    // add the toggle
    return (
      <div id="mapWrapper">
        <Tooltip></Tooltip>
        <div id="map" ref="mapElement" className="leaflet-container leaflet-retina leaflet-fade-anim" tabindex="0"></div>
        <BasemapToggle basemap={this.props.basemap}></BasemapToggle>
        <Legend active_layers={this.props.active_layers}></Legend>
      </div>
    )
  }

});

module.exports = Map
