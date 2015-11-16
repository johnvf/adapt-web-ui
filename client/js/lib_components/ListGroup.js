var React = require('react');

var ListGroup = React.createClass({

  render: function(){

    var items = this.props.children.map( function(child){
        return ( <li className="list-group-item">{child}</li> )
    });

    return (
      <ul className="list-group">
        { items }
      </ul>
      )
  }

});

module.exports = ListGroup