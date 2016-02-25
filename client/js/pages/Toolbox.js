var React = require('react');

var Loader = require('react-loader');
var TextStore = require('../stores/TextStore')

var Text = require('../lib_components/Text')

function getStateFromStores() {
  return {
    text: TextStore.getText( "toolbox" ),
  };
}

var Toolbox = React.createClass({

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
      <div className="row bg-toolbox" >
        <div className="col-md-4"></div>                 
        <div className="col-md-8">
          <div className = "text-scroll-body"> 
            <div className ="text-scroll">              
              { bodyMarkup }
            </div>
          </div>
        </div>
      </div> 
    );
  }
});

module.exports = Toolbox;