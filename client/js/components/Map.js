var React = require('react');

var mapboxgl = require('mapbox-gl');

var MouseActions = require("../actions/MouseActions");
var Tooltip = require('../components/MapTooltip');

function styleId(layer, styleIndex){
  return layer._id + "_" + styleIndex;
}

var Map = React.createClass({

  getInitialState: function(){
    return { activeStyles: {}, activeSources: {}};
  },

  componentDidMount: function(){
    var map = this.makeMap();
    this.setState({ map: map});
    this.addEventListeners(map);
  },

  componentWillReceiveProps: function(nextProps){
    var results = this.batchUpdateLayers(nextProps.active_layers);
    this.setState({activeStyles: results.styles, activeSources: results.sources})
  },

  addEventListeners: function(map){
    var self = this;
    map.on('mousemove', function( e ){
      map.featuresAt(e.point, {radius:5}, function( err, features ){
        if (err) throw err;
        MouseActions.featureHover(e, features);
      });
    });
  },

  batchUpdateLayers: function (newLayers){
    var self = this,
        map = this.state.map,
        diff = this.diffMapLayers(newLayers);
    if( this.state.map ){

      map.batch(function(batch){
        diff.remove.styles.map(batch.removeLayer, batch);
        diff.remove.sources.map(batch.removeSource, batch);
        diff.add.sources.map(function(s){
          batch.addSource(s.id, s.source);
        }, batch);
        diff.add.styles.map(function(style){
          batch.addLayer(style);
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
            addQueue.sources.push({
              id: source_id,
              source: layer.sources[source_id]
            });
          }
        }
      }
      layer.layers.forEach(function(style, i){
        var id = styleId(layer, i);
        newStyles[id] = style;
        if(!activeStyles.hasOwnProperty(id)){
          style.id = id;
          addQueue.styles.push(style);
        }
      });
    });

    for(id in activeStyles){
      if(activeStyles.hasOwnProperty(id)){
        if(!newStyles.hasOwnProperty(id)){
          removeQueue.styles.push(id);
        }
      }
    }
    for(key in activeSources){
      if(activeSources.hasOwnProperty(key)){
        if(!newSources.hasOwnProperty(key)){
          removeQueue.sources.push(key);
        }
      }
    }
    return {add: addQueue, remove: removeQueue, styles: newStyles, sources: newSources};
  },


  makeMap: function(){

    mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5iaW9maWx0ZXJkZXYiLCJhIjoiY2lnenZwdnNzMHdibnc3bTVrOWYzc3JraCJ9.eOfaXgitCGm4aqppPt6oHw';

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
        center: [ -122.3028, 37.8119], // starting position
        zoom: 15 // starting zoom
    });

    return map;
  },

  render: function() {
    return (
      <div id="mapWrapper">
        <Tooltip></Tooltip>
        <div id="map" className="leaflet-container leaflet-retina leaflet-fade-anim" tabindex="0"></div>
      </div>
    )
  }

});

module.exports = Map
