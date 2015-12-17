var React = require('react');

var Text = require('../lib_components/Text')

var Link = require('react-router').Link;
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var Data = React.createClass({

    renderResources: function(resources){
      var resourceMarkup = []
      var tag = this.props.tag

      Object.keys(resources).forEach( function(resourceType){

        var resourceLinks = [];

        resources[resourceType].forEach( function(item){
          resourceLinks.push(<div><Link to={"/adapt/oakland/"+tag+"/"+resourceType+"/"+item.slug}>{item.name}</Link></div>)
        })

        resourceMarkup.push( <div><h3>{ resourceType }</h3><ul>{ resourceLinks }</ul></div> )

      });

      return resourceMarkup
    },

    render: function(){
        // console.log(this.props.body)
        var text = !this.props.body ? "" : this.props.body.map(function(textItem){ return textItem.data }).join("\n");
        var resourceMarkup = !this.props.resources ? [] : this.renderResources( this.props.resources )

        switch ( this.props.view ) {
          case "map":
            return (
              <Grid id="data">
                <button style={{position: 'fixed', top: '5px', right: '5px', zIndex: 1000}} type="button" className="btn btn-xs btn-success" aria-label="Left Align" onClick={this.props.toggleView}>
                  <span className="glyphicon glyphicon-resize-full" aria-hidden="true" ></span>
                </button>
                <Row>
                  <Col xs={12} md={12}>
                    <Text className="body" body={text}/>
                  </Col>
                </Row>
              </Grid>
            )
            break;

          case "data":
            return (
              <Grid id="data">
                <button style={{position: 'fixed', top: '5px', right: '5px', zIndex: 1000}} type="button" className="btn btn-xs btn-success" aria-label="Left Align" onClick={this.props.toggleView}>
                  <span className="glyphicon glyphicon-resize-full" aria-hidden="true" ></span>
                </button>
                <Row>
                  <Col xs={12} md={12}>
                    <Text className="body" body={text}/>
                  </Col>
                  {
                  // <Col xs={6} md={4}>
                  //   <div className="body">
                  //     <h4>Resources</h4>
                  //     { resourceMarkup }
                  //   </div>
                  // </Col>
                  }
                </Row>
              </Grid>
            )
            break;
        }
    }
});

module.exports = Data