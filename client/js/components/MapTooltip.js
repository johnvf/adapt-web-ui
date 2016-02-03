// MapTooltip.js
var React = require('react');

var MouseActions = require('../actions/MouseActions');

var UserActionStore = require('../stores/UserActionStore');


var MapTooltip = React.createClass({

  getInitialState: function(){
    return {
      position: {
        x: 0,
        y: 0,
      },
      display: false,
      features: [],
    }
  },

  _onChange: function(){
    var features  = UserActionStore.getHoveredFeatures();
    var mapEvent = UserActionStore.getMapEvent();
    var display = features.length ? true : false;
    var rect = mapEvent.target._canvasContainer.getBoundingClientRect();
    this.setState({
      position: {
        x: mapEvent.originalEvent.clientX - rect.left,
        y: mapEvent.originalEvent.clientY - rect.top
      },
      display: display,
      features: features,
    });
  },

  componentDidMount: function(){
    UserActionStore.addChangeListener(this._onChange);
  },

  render: function() {
    var map = this.props.map;
    var display = this.state.display;
    var features = this.state.features;
    var position = this.state.position;
    var dx = 20;
    var dy = 0;
    var style = {
      left: position.x + dx,
      top: position.y + dy,
    }
    var featureDivs = [];

    if (features.length){
      features.forEach(function(feature){

        var keyConfig;
        var data = feature.layer.tool_tip_data;
        if( data ){
          keyConfig = data.fields;
        }
        if( keyConfig ){
          var rows = [];
          for( column in keyConfig ){
            var label, value;
            if( keyConfig.hasOwnProperty(column) ){
              label = keyConfig[column];
            }
            value = feature.properties[column];
            var featurePropDiv = (
              <div className="feature-property-row">
                <span className="feature-property-label">{label}</span>
                <span className="feature-property-value">{value}</span>
              </div>
              );
            rows.push(featurePropDiv);
          }
          var featureDiv = (
            <div className="feature">
              { rows }
            </div>
            );
          featureDivs.push(featureDiv);
        }
      });
    }
    var className = "map-tooltip" + (featureDivs.length ? " active" : " hidden");
    return (
      <div className={ className } style={ style }>
        {featureDivs}
      </div>
    );
  }

});

module.exports = MapTooltip;
