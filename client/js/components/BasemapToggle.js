

var React = require('react');
var ViewActions = require("../actions/ViewActions");
var Input = require('react-bootstrap/lib/Input');


var BasemapToggle = React.createClass({

  switchBasemap: function (e){
    var newBasemapKey = e.target.value;
    ViewActions.changeBasemapLayer(newBasemapKey);
  },

  render: function() {
    var basemap = this.props.basemap;
    var options;
    if(basemap === 'satellite'){
      options = [
        (<option value="satellite" key="satellite" selected>
          <span class="glyphicon glyphicon-globe"></span>
          Satellite
        </option>),
        (<option value="streets" key="streets">
          <span class="glyphicon glyphicon-road"></span>
          Streets
        </option>),
      ];
    } else {
      options = [
        (<option value="streets" key="streets" selected>
          <span class="glyphicon glyphicon-road"></span>
          Streets
        </option>),
        (<option value="satellite" key="satellite">
          <span class="glyphicon glyphicon-globe"></span>
          Satellite
        </option>),
      ];

    }

    return (
      <div className="map-basemap-toggle">
        <Input type="select" placeholder="Basemap" onChange={this.switchBasemap}>
          {options}
        </Input>
      </div>
    )
  }

});

module.exports = BasemapToggle;
