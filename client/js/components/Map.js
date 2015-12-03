var React = require('react');

var mapboxgl = require('mapbox-gl');

var Map = React.createClass({
  getInitialState: function(){
    return {}
  },

  componentDidMount: function(){
    this.setState({ map: this.makeMap( )});
  },

  componentWillReceiveProps: function(nextProps){
    // this.props contains old props & layers
    // remove old layers
    this.props.active_layers.forEach(function(layer){
      this.state.map.removeLayer(layer.id);
    })
  },

  makeMap: function( ){
    var tags = []//window.active_tags

    mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5iaW9maWx0ZXJkZXYiLCJhIjoiY2lnenZwdnNzMHdibnc3bTVrOWYzc3JraCJ9.eOfaXgitCGm4aqppPt6oHw';

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
        center: [ -122.3028, 37.8119], // starting position
        zoom: 15 // starting zoom
    });

    // Keep track of added sources
    map.sources_added = {}

    return map;
  },

  addMapLayers: function( map, map_list_item ){

    Object.keys( map_list_item.sources ).forEach( function( sourceName ){
      if( !map.sources_added[ sourceName ] ){
        map.addSource( sourceName , map_list_item.sources[sourceName] );
        map.sources_added[sourceName] = true
      }
    })

    map_list_item.layers.forEach( function(layer, index){
      map.addLayer( layer );
    })

  },

  render: function() {
    // old layers should be removed before render
    var self = this;
    var map = this.state.map;
    var active_layers = this.props.active_layers;

    if( map && active_layers.length ){
      active_layers.forEach(function(layer){
        self.addMapLayers(map, layer);
      });
    }

    return (
      <div>
        <div id="map" className="leaflet-container leaflet-retina leaflet-fade-anim" tabindex="0"></div>
      </div>
    )
  }

});

module.exports = Map
