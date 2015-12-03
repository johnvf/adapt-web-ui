var React = require('react');
var NavBar = require('react-bootstrap/lib/Navbar');
var Nav = require('react-bootstrap/lib/Nav');
var CollapsibleNav = require('react-bootstrap/lib/CollapsibleNav');
var NavItem = require('react-bootstrap/lib/NavItem');
var NavDropdown = require('react-bootstrap/lib/NavDropdown');
var NavBrand = require('react-bootstrap/lib/NavBrand');
var MenuItem = require('react-bootstrap/lib/MenuItem');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Popover = require('react-bootstrap/lib/Popover');
var Accordion = require('react-bootstrap/lib/Accordion');
var Panel = require('react-bootstrap/lib/Panel');
var Link = require('react-router').Link;
var History = require('react-router').History;

var MapStore = require('../stores/MapStore');
var Icon = require('../lib_components/Icon');
var MapLayerToggle = require('../components/MapLayerToggle');


function displayCase( snakeString ){
  return snakeString.split("_").map(function(w){ return w[0].toUpperCase() + w.slice(1); }).join(" ")
}

var Sidebar = React.createClass({

  mixins: [ History ],

  getPopover: function(maps){
    var self = this;
    // loo00l .. maps.map(function(map...))
    var MapPanels = maps.map(function(map, index){
      var GroupPanels = map.groups.map(function(group, index){

        var LayerItems = group.layers.map(function(layer, index){
          return(
            <MapLayerToggle key={index} layer={ layer }></MapLayerToggle>
            )
        });

        return (
          <Panel key={index} header={ displayCase(group.text) }>
            {LayerItems}
          </Panel>
          )
      });

      return(
        <Panel key={index} header={ displayCase(map.text) } eventKey={ index } onClick={ self.navigate.bind(null,'/adapt/oakland/' + map.tag.text) } >
          { GroupPanels }
        </Panel>
      )
    })

    return(
      <Popover placement="right" width={400} positionLeft={70} positionTop={0} title="MAP HOME">
        <Accordion>
          { MapPanels }
        </Accordion>
      </Popover>
    )
  },

  navigate: function(url){
    this.history.pushState(null, url)
  },

  render: function() {

    var loggedIn = this.props.loggedIn;
    var dropdown;

    var navbarClassName;
    var brandClassName;

    var mapsTree = this.props.mapTagTree;

    return (
      <div id="sidebar-wrapper">
        <ul className="toolbar-nav">
              <li className="brand">
                <Link to={"/adapt"}>
                  <Icon symbolID="icon-icon_logo"/>
                </Link>
              </li>
              <li>
                <Link to={ "/adapt/toolbox" }>
                  <Icon symbolID="icon-icon_toolbox"/>
                </Link>
              </li>
              <li>
                <OverlayTrigger trigger="click" placement="right" overlay={ this.getPopover(mapsTree) }>
                  <a><Icon symbolID="icon-icon_map"/></a>
                </OverlayTrigger>
              </li>
          </ul>
          <ul className="toolbar-nav bottom">
              <li>
                <Link to={ "/adapt/about" }>
                  <Icon symbolID="icon-icon_about"/>
                </Link>
              </li>
              <li>
                <Link to={ "/adapt/share" }>
                  <Icon symbolID="icon-icon_share"/>
                </Link>
              </li>
          </ul>

      </div>
    )
  }

});




module.exports = Sidebar;
