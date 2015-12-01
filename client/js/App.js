var React = require('react');

var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var IndexRoute = routerModule.IndexRoute;
var Redirect = routerModule.Redirect;

var ViewActions = require('./actions/ViewActions');

var createBrowserHistory = require('history/lib/createBrowserHistory');
var useBasename = require('history/lib/useBasename')

var TagStore = require('./stores/TagStore')
var MapStore = require('./stores/MapStore')
var Sidebar = require( './components/Sidebar')

// Pages
var Landing = require('./pages/Landing'),
    Home = require('./pages/Home'),
    Toolbox = require('./pages/Toolbox'),
    MapView = require('./pages/MapView'),
    About = require('./pages/About');


function getStateFromStores() {
  return {
    tags: TagStore.getTags(),
    maps: MapStore.getMaps(),
    mapTagTree: TagStore.getMapTagTree(),
    active_tags: TagStore.getActiveTags()
  };
}


var App = React.createClass({

  /**
   * State Boilerplate
   */
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TagStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TagStore.removeChangeListener(this._onChange);
  },


  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function () {
    var tags = this.state.tags;
    var active_tags = this.state.active_tags;
    var mapTagTree = this.state.mapTagTree;

    return (
      <div className= "app-loggedin">
        <Sidebar tags={tags} active_tags={active_tags} mapTagTree={mapTagTree} />
        <div className="container-fluid main centered">
          {this.props.children}
        </div>
      </div>
    );
  }
});


const history = useBasename(createBrowserHistory)({
  basename: ''
})

function urlChanged(){
  ViewActions.urlChanged( window.location.pathname )
}
// React-Router route configuration
// Essentially a mini-sitemap used to direct users to different pages
React.render((
  <Router history={ history } >
    <Route path="adapt" component={App}>
      <IndexRoute component={Home}/>
      <Route path="oakland" component={MapView}>
        <Route path=":tags" component={MapView} onEnter={ urlChanged }/>
      </Route>
      <Route path="toolbox" component={Toolbox}>
        <Route path=":tags" component={Toolbox} onEnter={ urlChanged }/>
      </Route>
      <Route path="about" component={About}/>
    </Route>
    <Route path="/*" component={Landing}/>
  </Router>
), document.body);
