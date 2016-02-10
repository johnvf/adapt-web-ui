// MapLegend.js
var React = require('react');


var MapLegend = React.createClass({

  render: function() {
    var layers = this.props.active_layers;
    console.log("rendering MapLegend with", layers);
    var legend_listings = []
    layers.forEach(function(layer){
      if(layer.hasOwnProperty("legend_text") && layer["legend_text"]){
        legend_listings.push((
          <div className="map-legend-listing">
            <div className="map-legend-listing-layer-name">{layer.name}</div>
            <div className="map-legend-listing-text">{layer.legend_text}</div>
          </div>
          ));
      }
    });
    return (
      <div className="map-legend">
        {legend_listings}
      </div>
      );
  },

});

module.exports = MapLegend;
