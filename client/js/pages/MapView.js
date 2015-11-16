var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var MapStore = require('../stores/MapStore')

function getStateFromStores() {
  return {
    map: MapStore.getMap(),
    loaded: false
  };
}

var Report = React.createClass({
  /**
   * State Boilerplate 
   */
  getInitialState: function() {  
    return getStateFromStores();
  },

  componentDidMount: function() {
    MapStore.addChangeListener(this._onChange);  
  },

  _onChange: function() {  
    this.setState(getStateFromStores())
  },

  render: function() {

    // var { project_id, report_id } = this.props.params;

    var content,
        loaded = this.state.loaded,
        map = this.state.map;

    if ( this.state.map ){
        content = (
          <Map  map={ map } />
        );
    }

    return (
      
        <div>
          <Loader loaded={loaded}>
            {content}
          </Loader>
        </div>
      
    )
  }
});

module.exports = Report;