var React = require('react');

var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var IndexRoute = routerModule.IndexRoute;
var Redirect = routerModule.Redirect;

var createBrowserHistory = require('history/lib/createBrowserHistory');
var useBasename = require('history/lib/useBasename')

var MapStore = require( './stores/MapStore')
var Sidebar = require( './components/Sidebar')

// Pages
var Landing = require('./pages/Landing'),
    MapView = require('./pages/MapView');


function getStateFromStores() {
  return {};
}


var App = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    // LoginStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function () {
    return (
      <div className= "app-loggedin">
        <Sidebar/>
        <div className="container-fluid centered">
          {this.props.children}
        </div>
      </div>
    );
  }
});


const history = useBasename(createBrowserHistory)({
  basename: ''
})

// React-Router route configuration
// Essentially a mini-sitemap used to direct users to different pages
React.render((
  <Router history={ history } >
    <Route path="/" component={App}>
      <IndexRoute component={Landing}/>
      <Route path="/map" component={MapView}/>
    </Route>
  </Router>
), document.body);
