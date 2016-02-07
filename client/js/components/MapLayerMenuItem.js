// MapLayerMenuItem.js

var React = require('react');
var ViewActions = require("../actions/ViewActions");

var MapLayerMenuItem = React.createClass({

  onLayerClick: function (e){
    e.preventDefault();
    e.stopPropagation();
    this.props.navigate(null, this.props.layer.tag.text);
  },

  onLayerMapDisplayClick: function () {
    var self = this;
    return function (e){
      ViewActions.toggleLayerMapDisplay(self.props.layer);
    };
  },

  render: function() {
    var layer = this.props.layer;
    var status = this.props.layer.map_item.is_displayed ? "●" : "○" ;
    // check if this layer is the active layer
    var className = "map-menu-layer";
    return (
      <li className={ className } >
        <span className="map-menu-layer-name" onClick={ this.onLayerClick }>
        { layer.text }
        </span>
        <span className="status-indicator" onClick={ this.onLayerMapDisplayClick() }>{ status }</span>
      </li>
    )
  }

});

module.exports = MapLayerMenuItem;
