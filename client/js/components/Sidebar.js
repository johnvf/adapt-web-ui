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


function displayCase( snakeString ){
  return snakeString.split("_").map(function(w){ return w[0].toUpperCase() + w.slice(1); }).join(" ")
}

var Sidebar = React.createClass({

  mixins: [ History ],

  getPopover: function(maps){
    var self = this;
    // loo00l .. maps.map(function(map...))
    var Panels = maps.map(function(map, index){
      return(
        <Panel header={ displayCase(map) } eventKey={ index } onClick={ self.navigate.bind(null,'/adapt/map/' + map) } >
          Map Groups/Layers here...
        </Panel>
      )
    })

    return(
      <Popover placement="right" width={400} positionLeft={70} positionTop={0} title="MAP HOME">
        <Accordion>
          { Panels }
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

    var maps = this.props.tags.map ? this.props.tags.map : []//["areas", "environmental_hazards", "design", "monitor"]

    // TODO
    // var map_groups = ["air", "water", "soil", "energy", "parallel_plans", "adaptation_strategies", "ecosystem_services", "areas"]
    // var map_layers = [...]

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
                <OverlayTrigger trigger="click" placement="right" overlay={ this.getPopover(maps) }>
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