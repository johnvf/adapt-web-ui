var React = require('react');

var Loader = require('react-loader');

var Icon = require('../lib_components/Icon');

var Landing = React.createClass({

  /**
   * State Boilerplate 
   */

  render: function() {


    return (
      <div className="row banner" >
        <a href ='/adapt'>
          <Icon className ="landing_icon" symbolID="icon-icon_logo"/>
          <h1>ADAPT</h1>
          <h3>AN ECOSYSTEM SERVICES MODEL</h3>
        </a>
      </div> 
    );
  }
});

module.exports = Landing;