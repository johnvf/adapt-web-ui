// MapLayerMenuItem.js

// MapTooltip.js
var React = require('react');
var ViewActions = require("../actions/ViewActions");

var MapLayerToggle = React.createClass({

  _onClick: function () {
    var self = this;
    return function (e){
      ViewActions.toggleMapLayer(self.props.layer);
    };
  },

  render: function() {
    var layerName = this.props.layer.text;
    var status = this.props.layer.is_active ? "●" : "○" ;
    var className = "map-menu-layer" + this.props.layer.is_active ? " active" : "";
    return (
      <div className={ className } onClick={ this._onClick() }>
        <span className="status-indicator">{ status }</span>
        <span className="map-menu-layer-name">
        { layerName }
        </span>
      </div>
    )
  }

});

module.exports = MapLayerToggle;
