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
    var bodyMarkup = text ? ( <Text className="body" body={text[0].data}/> ) : false
    
    return (
      <div className="row bg-toolbox" >
        <div className="col-md-6"></div>                 
        <div className="col-md-6">
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