var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var MapStore = require('../stores/MapStore')

// var Well = require('react-bootstrap/lib/Well');

var Dashboard = require('../components/Dashboard');

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

    //  FIXME: Integrate react-grid-layout instead
    var content = [],
        loaded = this.state.loaded,
        map_list = this.state.map_list;


        content.push( <Map map_list={ map_list } /> )
        content.push( <div> ADAPT OAKLAND AREA </div> )
        content.push( <div> DATA AVAILABLE </div>  )

    return (
      <Dashboard content={ content }/>
    )
  }
});

module.exports = Report;