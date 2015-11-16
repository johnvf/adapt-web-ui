var React = require('react');

var mapboxgl = require('mapbox-gl');
var uuid = require('node-uuid');


function makeMap( map_list ){
  var tags = []//window.active_tags

  mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5iaW9maWx0ZXJkZXYiLCJhIjoiY2lnenZwdnNzMHdibnc3bTVrOWYzc3JraCJ9.eOfaXgitCGm4aqppPt6oHw';

  var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
      center: [ -122.3028, 37.8119], // starting position
      zoom: 15 // starting zoom
  });

  
  // Keep track of visible map list items
  map.shown = {}
  
  // Keep track of added sources
  map.sources_added = {}

  // Once the active tags are passed into this controller, they would be used to toggle the available overlays. 
  // All overlays should always be available, but only those that match the active tags should be toggled on.
  map.on('style.load', function ( data ) {
     addData( map , map_list )
  });
}

// FIXME: this will now come from a flux store - which will know about active_tags
// // Obtain all maps, and styles that match the active tags from MongoDB

// function loadData( tags , callback ){
//   MapService.filter( tags, function( data ){
//     callback( data.payload ) //  map_list = data.payload 
//   });
// }

function addData( map, map_list){

  for (var key in map_list) {
    // Assign a unique ID to each layer
    map_list[key].layers.forEach( function(layer){ layer.id = uuid.v4() });

    var add = addMapLayers.bind(null, map, map_list[key])
    var remove = removeMapLayers.bind( null, map,  map_list[key] )

    addToMapUI(map, map_list[key], add , remove )
  }
}

function removeMapLayers( map, map_list_item ){
  map_list_item.layers.forEach( function(layer){
    map.removeLayer(layer.id);
  })
}

function addMapLayers( map, map_list_item ){
      
  Object.keys( map_list_item.sources ).forEach( function( sourceName ){
    if( !map.sources_added[ sourceName ] ){
      map.addSource( sourceName , map_list_item.sources[sourceName] );
      map.sources_added[sourceName] = true
    }
  })

  map_list_item.layers.forEach( function(layer){
    map.addLayer( layer );
  })
  
}

function addToMapUI( map, map_list_item , addCallback, removeCallback ){

  var ui = document.getElementById('map-ui');
  var item = document.createElement('li');
  var link = document.createElement('a');

  link.href = '#';
  link.innerHTML = map_list_item.name;

  link.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if ( map.shown[map_list_item.name] ) {
          removeCallback();
          this.className = '';
          map.shown[map_list_item.name] = false
          // map.legendControl.removeLegend(layer.getTileJSON().legend);
      } else {
          addCallback();
          this.className = 'active';
          map.shown[map_list_item.name] = true
          // map.legendControl.addLegend(layer.getTileJSON().legend);
      }
  };

  item.appendChild(link);
  ui.appendChild(item);
}

var Map = React.createClass({

  componentDidMount: function(){
    makeMap( this.props.map_list )
  },

  render: function() {

    return (
      <div>
        <ul id="map-ui"></ul>
        <div id="map" className="leaflet-container leaflet-retina leaflet-fade-anim" tabindex="0"></div>
      </div>
    )
  }

});

module.exports = Map