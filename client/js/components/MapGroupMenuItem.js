// MapGroupMenuItem.js
var React = require('react');
var ViewActions = require("../actions/ViewActions");

var MapLayerMenuItem = require('../components/MapLayerMenuItem');

var MapGroupMenuItem = React.createClass({

  onGroupClick: function () {
    var self = this;
    return function (e){
      // do nothing if this is the current group
      if( self.props.group.is_active ) {
          return;
      } else {
        ViewActions.groupClicked(self.props.group);
      }
    };
  },


  render: function() {
    var group = this.props.group;
    var groupName = group.text;
    var className = "group-menu-item" + group.is_active ? " active" : "";

    var layerItems = group.layers.map(function(layer, index){
      return(
        <MapLayerMenuItem key={index} layer={ layer }></MapLayerMenuItem>
        )
    });

    return (
      <li className={ className } >
        <h3 className="group-menu-item-header" onClick={ this.onGroupClick() }>
        { groupName }
        </h3>
        <ul className="map-layer-menu">
            { layerItems }
        </ul>
      </li>
    )
  }

});

module.exports = MapGroupMenuItem;
