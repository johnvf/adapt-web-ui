var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var MapStore = require('../stores/MapStore')

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

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
    var content,
        loaded = this.state.loaded,
        map_list = this.state.map_list;

    if ( map_list ){
        content = ( <Map map_list={ map_list } /> )
    }

    return (
      
        <div>
          <Grid>
            <Row>
              <Col md={9}>
                <Loader loaded={loaded}>
                  {content}
                </Loader>
              </Col>
              <Col md={3}>
                Text + Data
              </Col>
            </Row>

          </Grid>
        </div>
      
    )
  }
});

module.exports = Report;