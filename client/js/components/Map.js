var React = require('react');

var mapboxgl = require('mapbox-gl');

var Map = React.createClass({

  getInitialState: function(){
    return {shown: {}}
  },

  componentDidMount: function(){
    this.setState({ map: this.makeMap( )});
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

  removeMapLayers: function( map, map_list_item ){
    map_list_item.layers.forEach( function(layer, index){
      map.removeLayer(layer.id);
    })
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

  toggleMapLayer: function( map, map_list_item , addCallback, removeCallback ){
    // e.preventDefault();
    // e.stopPropagation();

    if ( this.state.shown[map_list_item.name] ) {
        removeCallback();
        this.className = '';
        this.state.shown[map_list_item.name] = false
        // map.legendControl.removeLegend(layer.getTileJSON().legend);
    } else {
        addCallback();
        this.className = 'active';
        this.state.shown[map_list_item.name] = true
        // map.legendControl.addLegend(layer.getTileJSON().legend);
    }
    // Rerender with updated 'shown'
    this.setState({shown: this.state.shown})
  },

  render: function() {

    var self = this;
    var map = this.state.map;
    var map_list = this.props.map_list

    // FIXME: This layer control stuff should be rebuilt in the Sidebar component....
    // Need to refactor so that it doesn't depend on the map existing first
    var layer_control = [];

    if( map  && map_list ){
      map_list.forEach( function( map_list_item , key){
        map_list_item.layers.forEach( function(layer, index){ layer.id = String(index)+map_list_item._id; })
        var add = self.addMapLayers.bind(null, map, map_list_item)
        var remove = self.removeMapLayers.bind( null, map,  map_list_item )

        var className = self.state.shown[map_list_item.name] ? 'active' : ''

        layer_control.push( 
          <li key={key}>
            <a className={className} onClick={ self.toggleMapLayer.bind( null, map, map_list_item, add, remove )}>{map_list_item.name}</a>
          </li>
        )
      });
    }

    return (
      <div>
        <ul id="map-ui">
          { layer_control }
        </ul>
        <div id="map" className="leaflet-container leaflet-retina leaflet-fade-anim" tabindex="0"></div>
      </div>
    )
  }

});

module.exports = Map