var React = require('react');

var mapboxgl = require('mapbox-gl');

var MouseActions = require("../actions/MouseActions");
var Tooltip = require('../components/MapTooltip');

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
    return { activeStyles: {}, activeSources: {}};
  },

  componentDidMount: function(){
    var map = this.makeMap();
    this.setState({ map: map});
    this.addEventListeners(map);

    var self = this;
    window.onresize = function(){
      self.resizeMap();
    }
  },

  componentWillReceiveProps: function(nextProps){
    var results = this.batchUpdateLayers(nextProps.active_layers);
    console.log("new active layers:", nextProps.active_layers)
    this.setState({activeStyles: results.styles, activeSources: results.sources})
    this.resizeMap();
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


  makeMap: function(){

    mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5iaW9maWx0ZXJkZXYiLCJhIjoiY2lnenZwdnNzMHdibnc3bTVrOWYzc3JraCJ9.eOfaXgitCGm4aqppPt6oHw';

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/light-v8', //stylesheet location
        center: [ -122.2226, 37.7541], // starting position
        zoom: 11 // starting zoom
    });
    return map;
  },

  render: function() {
    return (
      <div id="mapWrapper">
        <Tooltip></Tooltip>
        <div id="map" ref="mapElement" className="leaflet-container leaflet-retina leaflet-fade-anim" tabindex="0"></div>
      </div>
    )
  }

});

module.exports = Map
