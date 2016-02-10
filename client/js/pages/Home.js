var React = require('react');

var Loader = require('react-loader');
var TextStore = require('../stores/TextStore');
var Link = require('react-router').Link;

var Text = require('../lib_components/Text')

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
    var bodyMarkup = text ? ( <Text className="body" body={text[0].data}/> ) : false

    return (
      
        <div className="container-fluid bg-green" >
          <Loader loaded={true}>
            <div className="row home">           
              <div className="col-xs-6 col-md-9 home-description">
                <div className="row home-options">
                  <h1 className="left light-text">ADAPT:</h1>
                  <h3 className="left light-text">AN ECOSYSTEM SERVICES MODEL</h3> 
                </div>
                <div className="row bg-light home-options">
                  { bodyMarkup }
                </div>
              </div>
              <div className="col-xs-5 col-md-3">
                  <div className="row bg-light home-options">
                   <Link to={ "/adapt/toolbox" }>
                      <div className= "home-heading">
                        <Icon className ="green-fill options-icon" symbolID="icon-icon_toolbox"/>
                        <h3 className ="options-heading"> ADAPT <br /> TOOLBOX</h3>
                      </div>
                    </Link>
                    <p>The Adaptation Toolbox provides tools and methodologies for community members, legislators, developers, and researchers to evaluate current conditions and design solutions for mitigating environmental hazards in cities across the country.</p> 
                  </div>
                <div className="row bg-light home-options">
                  <Link to={ "/adapt/oakland/1_analyze" }>
                    <div className= "home-heading">
                      <Icon className ="green-fill options-icon"  symbolID="icon-icon_map"/>
                      <h3 className ="options-heading" > ADAPT <br /> OAKLAND</h3>
                    </div>
                  </Link>
                  <p>With a highly diverse range of land uses, including a major port, an industrial zone, a residential neighborhood, and a ring of interstate highways, West Oakland is representative of the conditions and challenges found in many urban centers.</p> 
                </div>
              </div>
            </div>           
          </Loader>
        </div>
    );
  }
});

module.exports = Home;
