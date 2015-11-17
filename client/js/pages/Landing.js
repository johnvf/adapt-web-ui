var React = require('react');

var Loader = require('react-loader');

var Landing = React.createClass({

  /**
   * State Boilerplate 
   */

  render: function() {


    return (
      <div className="row banner" >
        <a href ='/adapt'>
          <img alt="adaptOAKLAND" title="adaptOAKLAND" id="intro-globe" src="http://adaptoakland.org/wp-content/uploads/2013/04/adaptOAKLAND-logo-large.png"/>
          <h1>ADAPT</h1>
          <h3>AN ECOSYSTEM SERVICES MODEL</h3>
        </a>
      </div> 
    );
  }
});

module.exports = Landing;