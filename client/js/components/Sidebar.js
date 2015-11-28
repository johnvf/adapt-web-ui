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

var MapStore = require('../stores/MapStore')


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
            <li>{ layer.text }</li>
            )
        });

        return (
          <Panel header={ displayCase(group.text) }>
            {LayerItems}
          </Panel>
          )
      });

      return(
        <Panel header={ displayCase(map.text) } eventKey={ index } onClick={ self.navigate.bind(null,'/adapt/map/' + map.tag.text) } >
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
                <Link to={ "/adapt" }></Link>
              </li>
              <li>
                <Link to={ "/adapt/toolbox" }></Link>
              </li>
              <li>
                <OverlayTrigger trigger="click" placement="right" overlay={ this.getPopover(mapsTree) }>
                  <a id="map-icon"></a>
                </OverlayTrigger>
              </li>
          </ul>
          <ul className="toolbar-nav bottom">
              <li>
                <Link to={ "/adapt/about" }></Link>
              </li>
              <li>
                <Link to={ "/adapt/share" }></Link>
              </li>
          </ul>

      </div>
    )
  }

});

          // <ul className="sidebar-nav">
          //     <li className="sidebar-brand">
          //         <a href="#">
          //             Start Bootstrap
          //         </a>
          //     </li>
          //     <li>
          //         <a href="#">Dashboard</a>
          //     </li>
          //     <li>
          //         <a href="#">Shortcuts</a>
          //     </li>
          //     <li>
          //         <a href="#">Overview</a>
          //     </li>
          //     <li>
          //         <a href="#">Events</a>
          //     </li>
          //     <li>
          //         <a href="#">About</a>
          //     </li>
          //     <li>
          //         <a href="#">Services</a>
          //     </li>
          //     <li>
          //         <a href="#">Contact</a>
          //     </li>
          // </ul>
          // <ul className="sidebar-nav bottom">
          //     <li>
          //         <a href="#">Dashboard</a>
          //     </li>
          //     <li>
          //         <a href="#">Shortcuts</a>
          //     </li>
          //     <li>
          //         <a href="#">Overview</a>
          //     </li>
          //     <li>
          //         <a href="#">Events</a>
          //     </li>
          //     <li>
          //         <a href="#">About</a>
          //     </li>
          //     <li>
          //         <a href="#">Services</a>
          //     </li>
          //     <li>
          //         <a href="#">Contact</a>
          //     </li>
          // </ul>

module.exports = Sidebar;
