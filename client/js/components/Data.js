var React = require('react');
var marked = require('marked');

var renderer = new marked.Renderer();

var Link = require('react-router').Link;
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

renderer.heading = function (text, level) {
  var escapedText =  text.toLowerCase().split(/[^\w]+/g).slice(3).join('_');

  return '<h' + level + '><a name="' +
                escapedText +
                 '" class="anchor" href="#' +
                 escapedText +
                 '"><span class="header-link"></span></a>' +
                  text + '</h' + level + '>';
}

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
                <button style={{position: 'fixed', top: '30px', right: '60px', zIndex: 1000}} type="button" className="btn btn-default" aria-label="Left Align" onClick={this.props.toggleView}>
                  <span className="glyphicon glyphicon-resize-full" aria-hidden="true" ></span>
                </button>
                <Row>
                  <Col xs={12} md={12}>
                    <div className="body"  dangerouslySetInnerHTML={ { __html: marked(text, {renderer: renderer}) } }/>
                  </Col>
                </Row>
              </Grid>
            )
            break;

          case "data":
            return (
              <Grid id="data">
                <button style={{position: 'fixed', top: '30px', right: '60px', zIndex: 1000}} type="button" className="btn btn-default" aria-label="Left Align" onClick={this.props.toggleView}>
                  <span className="glyphicon glyphicon-resize-full" aria-hidden="true" ></span>
                </button>
                <Row>
                  <Col xs={12} md={8}>
                    <div className="body"  dangerouslySetInnerHTML={ { __html: marked(text, {renderer: renderer}) } }/>
                  </Col>
                  <Col xs={6} md={4}>
                    <h4>Resources</h4>
                    { resourceMarkup }
                  </Col>
                </Row>
              </Grid>
            )
            break;
        }
    }
});

module.exports = Data