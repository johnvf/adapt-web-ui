var React = require('react');

var Loader = require('react-loader');

var Home = React.createClass({

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

module.exports = Home;