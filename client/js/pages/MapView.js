var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');

var MapStore = require('../stores/MapStore')
var TextStore = require('../stores/TextStore')
var TagStore = require('../stores/TagStore')

// var Well = require('react-bootstrap/lib/Well');

var Dashboard = require('../components/Dashboard');

var Map = require('../components/Map')
var Data = require('../components/Data')

function getStateFromStores() {
  var urlTags = TagStore.getURLTags()[0]
  return {
    map_list: MapStore.getMaps( urlTags ),
    text: TextStore.getText( urlTags ),
    textLoaded: TextStore.isLoaded(),
    mapLoaded: MapStore.isLoaded(),
    tags: TagStore.getTags(),
    active_tags: TagStore.getActiveTags(),
  };
}

var MapView = React.createClass({
  /**
   * State Boilerplate 
   */
  getInitialState: function() {  
    var state = getStateFromStores();
    state.view = "map"
    return state
  },

  componentDidMount: function() {
    MapStore.addChangeListener(this._onChange);  
    TagStore.addChangeListener(this._onChange);  
    TextStore.addChangeListener(this._onChange);  
  },

  componentWillUnmount: function() {
    MapStore.removeChangeListener(this._onChange);
    TagStore.removeChangeListener(this._onChange);
    TextStore.addChangeListener(this._onChange);  
  },


  _onChange: function() {  
    this.setState(getStateFromStores())
  },

  toggleView: function(){
    switch ( this.state.view ) {
      case "map":
        this.setState({ view: "data" });
        break;

      case "data":
        this.setState({ view: "map" });
        break;

      default:
    }
  },

  render: function() {

    var content = [],
        loaded = this.state.loaded,
        view = this.state.view,
        map_list = this.state.map_list,
        text = this.state.text || "",
        // text = "Report text here",
        tags = this.state.tags,
        active_tags = this.state.active_tags;

        content.push( <Map tags={this.state.tags} active_tags={active_tags} map_list={ map_list } /> )
        content.push( <Data toggleView={ this.toggleView} body={text}/>)
        content.push( <div> DATA AVAILABLE </div>  )

    return (
      <Dashboard view={view} content={ content }/>
    )
  }
});

module.exports = MapView;