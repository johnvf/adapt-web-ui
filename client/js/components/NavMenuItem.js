// MapLayerMenuItem.js

var React = require('react');
var ViewActions = require("../actions/ViewActions");

var NavMenuItem = React.createClass({

  onLayerClick: function (e){
    e.preventDefault();
    e.stopPropagation();
    this.props.navigate(null, this.props.layer.tag.text);
  },

  render: function() {
    var layer = this.props.layer;
    var status = this.props.layer.is_displayed ? "●" : "○" ;
    // check if this layer is the active layer
    var className = "map-menu-layer";
    return (
      <li className={ className } >
        <span className="map-menu-layer-name" onClick={ this.onLayerClick }>
        { layer.text }
        </span>
      </li>
    )
  }

});

module.exports = NavMenuItem;
