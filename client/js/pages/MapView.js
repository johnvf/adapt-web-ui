var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');

var MapStore = require('../stores/MapStore')
var TextStore = require('../stores/TextStore')
var TagStore = require('../stores/TagStore')
var ChartStore = require('../stores/ChartStore')
var TableStore = require('../stores/TableStore')
var PlantListStore = require('../stores/PlantListStore')
var CitationStore = require('../stores/CitationStore')
var CaseStudyStore = require('../stores/CaseStudyStore')
var ImageStore = require('../stores/ImageStore')

var Dashboard = require('../components/Dashboard');
var Modal = require('../lib_components/Modal');
var Chart = require('../lib_components/Chart');
var Table = require('../lib_components/Table');
var Image = require('../lib_components/Image');

var Map = require('../components/Map');
var Data = require('../components/Data');
var Resources = require('../components/Resources');

var camelCaseToRegular = require('../utils/Utils').camelCaseToRegular

function getStateFromStores( tag , resource , slug ) {
  console.log(tag)
  var modal,
      item,
      content;

  if( resource && slug ){
    console.log("resource", resource)
    console.log("slug", slug)
    switch ( resource) {
      case "chart":
        item = ChartStore.getCharts( slug )
        console.log(item)
        content = <Chart key={slug} item={ item } id={slug}/>
        break;

      case "table":
        item = TableStore.getTables( slug )
        console.log(item)
        content = <Table key={slug} item={ item }/>
        break;

      case "plantList":
        item = PlantListStore.getPlantLists( slug )
        console.log(item)
        content = <Table key={slug} item={ item }/>
        break;

      case "citation":
        item = CitationStore.getCitations( slug )
        console.log(item)
        content = <Table key={slug} item={ item }/>
        break;

      case "caseStudy":
        item = CaseStudyStore.getCaseStudies( slug )
        console.log(item)
        content = <Table key={slug} item={ item }/>
        break;

      case "image":
        item = ImageStore.getImages( slug )
        console.log(item)
        content = <Image key={slug} item={ item }/>
        break;

      default:
    }
    // var caption = item.caption ? <label className="caption">{item.caption}</label> : null
    if( item && content ){
      modal = <Modal show={true} content={ content } caption={item.caption} title={ camelCaseToRegular(resource) + " | " + item.name }/>
    }
  }

  return {
    map_list: MapStore.getMaps( tag),
    text: TextStore.getText( tag ),
    charts: ChartStore.getCharts( tag ),
    tables: TableStore.getTables( tag ),
    plantLists: PlantListStore.getPlantLists( tag ),
    citations: CitationStore.getCitations( tag ),
    caseStudies: CaseStudyStore.getCaseStudies( tag ),
    images: ImageStore.getImages( tag ),
    textLoaded: TextStore.isLoaded(),
    mapLoaded: MapStore.isLoaded(),
    tags: TagStore.getTags(),
    activeMapLayers: MapStore.getActiveLayers(),
    currentBasemap: MapStore.getCurrentBasemap(),
    active_tags: TagStore.getActiveTags(),
    modal: modal
  };
}

var MapView = React.createClass({
  /**
   * State Boilerplate
   */
  getInitialState: function() {
    var state = getStateFromStores( this.props.params.tag , this.props.params.resource , this.props.params.slug );
    state.view = "data" // this.props.params.resource ? "data" : "map"
    return state
  },

  // URL param changes have State consequences, need to be handled here.
  componentWillReceiveProps: function(nextProps){
    this.setState(getStateFromStores( nextProps.params.tag , nextProps.params.resource , nextProps.params.slug ))
  },

  _onChange: function() {
    this.setState(getStateFromStores( this.props.params.tag ,  this.props.params.resource ,  this.props.params.slug ))
  },

  componentDidMount: function() {
    MapStore.addChangeListener(this._onChange);
    TagStore.addChangeListener(this._onChange);
    TextStore.addChangeListener(this._onChange);
    ChartStore.addChangeListener(this._onChange);
    TableStore.addChangeListener(this._onChange);
    PlantListStore.addChangeListener(this._onChange);
    CitationStore.addChangeListener(this._onChange);
    CaseStudyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MapStore.removeChangeListener(this._onChange);
    TagStore.removeChangeListener(this._onChange);
    TextStore.removeChangeListener(this._onChange);
    ChartStore.removeChangeListener(this._onChange);
    TableStore.removeChangeListener(this._onChange);
    PlantListStore.removeChangeListener(this._onChange);
    CitationStore.removeChangeListener(this._onChange);
    CaseStudyStore.removeChangeListener(this._onChange);
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
        active_layers = this.state.activeMapLayers,
        currentBasemap = this.state.currentBasemap,
        text = this.state.text || "",
        resources = {
          chart: this.state.charts ? this.state.charts : [],
          table: this.state.tables ? this.state.tables : [],
          plantList: this.state.plantLists ? this.state.plantLists : [],
          citation: this.state.citations ? this.state.citations : [],
          caseStudy: this.state.caseStudies ? this.state.caseStudies : [],
          image: this.state.images ? this.state.images : []
        },
        tags = this.state.tags,
        active_tags = this.state.active_tags;

        var modal = this.state.modal;
        // These will become widgets in the dashboard
        // Note: currently the widget layouts are hardcoded.
        // don't change this without updating the layouts
        content.push( <Map active_layers={ active_layers } view={view} basemap={currentBasemap}/> )
        content.push( <Data tag={this.props.params.tag} view={view} toggleView={ this.toggleView} body={text}/>)
        content.push( <Resources tag={this.props.params.tag} resources={ resources }/> )

    return (
      <div className="map-view">
        { modal }
        <Dashboard view={view} content={ content } />
      </div>
    )
  }
});

module.exports = MapView;
