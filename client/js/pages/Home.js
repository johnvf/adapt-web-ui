var React = require('react');

var Loader = require('react-loader');
var TextStore = require('../stores/TextStore');
var Link = require('react-router').Link;

var Text = require('../lib_components/Text')

var WebAPIUtils = require('../utils/WebAPIUtils');

function getStateFromStores() {
  return {
    text: TextStore.getText( "home" ),
  };
}

var Icon = require('../lib_components/Icon');

var Home = React.createClass({

  /**
   * State Boilerplate 
   */
  getInitialState: function() {
    return getStateFromStores()
  },
  _onChange: function() {
    this.setState(getStateFromStores())
  },
  componentDidMount: function() {
    TextStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    TextStore.removeChangeListener(this._onChange);
  },

  render: function() {

    var text = this.state.text

    var bodyText = text ? text[0].data : null
    var bodyMarkup = <Text className="text-scroll" body={ bodyText }/>

    return (
      
        <div className="container-fluid bg-green" >
          <Loader loaded={true}>
            <div className="row home">           
              <div className="col-xs-12 col-sm-3">
                <Link to={ "/adapt/toolbox" }>
                  <div className="bg-light home-options">
                      <div className= "home-heading">
                        <Icon className ="green-fill options-icon" symbolID="icon-icon_toolbox"/>
                        <h3 className ="options-heading"> ADAPT <br /> TOOLBOX</h3>
                      </div>
                    <p>The Adaptation Toolbox provides tools and methodologies for community members, legislators, developers, and researchers to evaluate current conditions and design solutions for mitigating environmental hazards in cities across the country.</p> 
                  </div>
                </Link>
                <Link to={ "/adapt/oakland/introduction" }>
                  <div className="bg-light home-options last">
                      <div className= "home-heading">
                        <Icon className ="green-fill options-icon"  symbolID="icon-icon_map"/>
                        <h3 className ="options-heading" > ADAPT <br /> OAKLAND</h3>
                      </div>
                    <p>With a highly diverse range of land uses, including a major port, an industrial zone, a residential neighborhood, and a ring of interstate highways, West Oakland is representative of the conditions and challenges found in many urban centers.</p> 
                  </div>
                </Link>
              </div>
              <div className="col-xs-12 col-sm-9 home-description">
                <div className="text-scroll-body">
                  { bodyMarkup }
                </div>
              </div>
            </div>           
          </Loader>
        </div>
    );
  }
});

module.exports = Home;
