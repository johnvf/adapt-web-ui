var React = require('react');

var Text = require('../lib_components/Text.jsx')

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var Data = React.createClass({

    componentDidUpdate: function(){
      // window.scrollTo(0, 0);
      // var elem = React.findDOMNode(this.refs.text);
      // var links = elem.querySelectorAll('[href]')
      // // console.log(links)
    },

    componentWillUpdate: function(nextProps){
      if (this.props.body !== nextProps.body){
        var elem = React.findDOMNode(this.refs.text);
        elem.scrollIntoView();
      }
    },

    render: function(){
      var text = !this.props.body ? "" : this.props.body.map(function(textItem){ return textItem.data }).join("\n");

      return (
        <Grid id="data">
          <button style={{position: 'fixed', top: '5px', right: '20px', zIndex: 1000}} type="button" className="btn btn-xs btn-success" aria-label="Left Align" onClick={this.props.toggleView}>
            <span className="glyphicon glyphicon-resize-full" aria-hidden="true" ></span>
          </button>
          <Row>
            <Col xs={12} md={12}>
              <Text className="body" body={text} ref="text"/>
            </Col>
          </Row>
        </Grid>
      )
    }
});

module.exports = Data