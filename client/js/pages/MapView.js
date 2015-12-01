var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');

var MapStore = require('../stores/MapStore')
var TextStore = require('../stores/TextStore')
var TagStore = require('../stores/TagStore')

// var Well = require('react-bootstrap/lib/Well');

var Dashboard = require('../components/Dashboard');

var Map = require('../components/Map')
var Text = require('../lib_components/Text')

function getStateFromStores() {
  var urlTags = TagStore.getURLTags()[0]
  return {
    map_list: MapStore.getMaps( urlTags ),
    text: TextStore.getText( urlTags ),
    textLoaded: TextStore.isLoaded(),
    mapLoaded: MapStore.isLoaded(),
    tags: TagStore.getTags(),
    active_tags: TagStore.getActiveTags()
  };
}

var MapView = React.createClass({
  /**
   * State Boilerplate 
   */
  getInitialState: function() {  
    return getStateFromStores();
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

  render: function() {

    var content = [],
        loaded = this.state.loaded,
        map_list = this.state.map_list,
        // text = this.state.text || "",
        text = "Report text here",
        tags = this.state.tags,
        active_tags = this.state.active_tags;

        content.push( <Map tags={this.state.tags} active_tags={active_tags} map_list={ map_list } /> )
        content.push( <Text body={text}/>)
        content.push( <div> DATA AVAILABLE </div>  )

    return (
      <Dashboard content={ content }/>
    )
  }
});

module.exports = MapView;