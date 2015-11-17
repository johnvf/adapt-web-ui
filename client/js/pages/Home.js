var React = require('react');

var Loader = require('react-loader');

var Landing = React.createClass({

  /**
   * State Boilerplate 
   */

  render: function() {


    return (
      
        <div>
          <Loader loaded={true}>
            HOME PAGE
          </Loader>
        </div>
    );
  }
});

module.exports = Landing;