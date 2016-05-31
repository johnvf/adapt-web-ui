var React = require('react');

// var Icon = require('../lib_components/Icon');
var BigIcon = require('../lib_components/BigIcon.jsx');

var Landing = React.createClass({
  /**
   * State Boilerplate 
   */

  render: function() {


    return (
      <div className="row banner" >
        <a href ='/adapt'>
          <BigIcon className ="landing_icon Adapt" symbolID="Adapt"/>
          <BigIcon className ="landing_icon Evaluate" symbolID="Evaluate"/>
          <BigIcon className ="landing_icon Monitor" symbolID="Monitor"/>
          <BigIcon className ="landing_icon Implement" symbolID="Implement"/>
          <BigIcon className ="landing_icon Design" symbolID="Design"/>
          <BigIcon className ="landing_icon Analyze" symbolID="Analyze"/>
          <h1 className="light-text">ADAPT</h1>
          <h3 className="light-text">AN ECOSYSTEM SERVICES MODEL</h3>
          <span className="glyphicon glyphicon-arrow-right" aria-hidden="true" ></span>
        </a>
      </div> 
    );
  }
});

module.exports = Landing;