var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');

var MapStore = require('../stores/MapStore')
var TextStore = require('../stores/TextStore')
var TagStore = require('../stores/TagStore')
var ChartStore = require('../stores/ChartStore')
var TableStore = require('../stores/TableStore')

// var Well = require('react-bootstrap/lib/Well');

var Dashboard = require('../components/Dashboard');
var Modal = require('../lib_components/Modal');
var Chart = require('../lib_components/Chart');
var Table = require('../lib_components/Table');

var Map = require('../components/Map')
var Data = require('../components/Data')

function getStateFromStores( tag ) {
  return {
    map_list: MapStore.getMaps( tag),
    text: TextStore.getText( tag ),
    textLoaded: TextStore.isLoaded(),
    mapLoaded: MapStore.isLoaded(),
    tags: TagStore.getTags(),
    activeMapLayers: MapStore.getActiveLayers(),
    active_tags: TagStore.getActiveTags(),

  };
}

var MapView = React.createClass({
  /**
   * State Boilerplate
   */
  getInitialState: function() {
    var state = getStateFromStores( this.props.params.tag );

    state.map_list = MapStore.getMaps( this.props.params.tag );
    state.text = TextStore.getText( this.props.params.tag );
    state.view = this.props.params.resource ? "data" : "map"

    return state
  },

  // URL param changes have State consequences, need to be handled here.
  componentWillReceiveProps: function(nextProps){
    this.setState(getStateFromStores( nextProps.params.tag ))
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
    this.setState(getStateFromStores( this.props.params.tag ))
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

  // FIXME: This is wastefule on each render. 
  //It should 'get' the data when props change
  getModalContent: function(){
    var content;
    switch ( this.props.params.resource ) {
      case "chart":
        var item = ChartStore.getCharts(this.props.params.slug)
        content = item ? <Chart item={ item } id={this.props.params.slug}/> : ""
        break;

      case "table":
        var item = TableStore.getTables(this.props.params.slug)
        content = item ? <Table item={ item }/> : ""
        break;

      default:
    }
    return content
  },

  render: function() {

    var content = [],
        loaded = this.state.loaded,
        view = this.state.view,
        active_layers = this.state.activeMapLayers,
        text = this.state.text || "",
        // text = "Report text here",
        tags = this.state.tags,
        active_tags = this.state.active_tags,
        modalShown,
        modalTitle,
        modalContent;

        // If a resource is found in the url params, show it in the modal
        if( this.props.params.resource ){
          modalShown = true
          modalContent = this.getModalContent();
          // Placeholder title
          modalTitle = this.props.params.resource + " | " + this.props.params.slug
        }

        // These will become widgets in the dashboard
        // Note: currently the widget layouts are hardcoded.
        // don't change this without updating the layouts
        content.push( <Map active_layers={ active_layers } /> )
        content.push( <Data toggleView={ this.toggleView} body={text}/>)
        content.push( <div> DATA AVAILABLE </div>  )

    return (
      <div>
        <Modal show={modalShown} content={ modalContent } title={modalTitle}/>
        <Dashboard view={view} content={ content }/>
      </div>
    )
  }
});

module.exports = MapView;
