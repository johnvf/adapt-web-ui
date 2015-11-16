var React = require('react');
var NavBar = require('react-bootstrap/lib/Navbar');
var Nav = require('react-bootstrap/lib/Nav');
var CollapsibleNav = require('react-bootstrap/lib/CollapsibleNav');
var NavItem = require('react-bootstrap/lib/NavItem');
var NavDropdown = require('react-bootstrap/lib/NavDropdown');
var NavBrand = require('react-bootstrap/lib/NavBrand');
var MenuItem = require('react-bootstrap/lib/MenuItem');
var Link = require('react-router').Link;

var MapStore = require('../stores/MapStore')

var Sidebar = React.createClass({

  render: function() {

    var loggedIn = this.props.loggedIn;
    var dropdown;

    var navbarClassName;
    var brandClassName;

    return (
      <div id="sidebar-wrapper">
        <ul className="toolbar-nav">
              <li className="brand"> 
                <Link to={ "/" }></Link>
              </li>
              <li>
                <Link to={ "/toolbox" }></Link>
              </li>
              <li>
                <Link to={ "/map" }></Link>
              </li>
          </ul>          
          <ul className="toolbar-nav bottom">
              <li>
                <Link to={ "/about" }></Link>
              </li>
              <li>
                <Link to={ "/share" }></Link>
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