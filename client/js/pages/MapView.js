var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var MapStore = require('../stores/MapStore')

var Map = require('../components/Map')

function getStateFromStores() {
  return {
    map_list: MapStore.getMaps(),
    loaded: MapStore.isLoaded()
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
        map_list = this.state.map_list;

    if ( map_list ){
        content = ( <Map map_list={ map_list } /> )
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