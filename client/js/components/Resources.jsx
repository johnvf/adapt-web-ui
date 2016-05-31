var React = require('react');

var Icon = require('../lib_components/Icon.jsx');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var Link = require('react-router').Link;

var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Popover = require('react-bootstrap/lib/Popover');
var Button = require('react-bootstrap/lib/Button');

var camelCaseToRegular = require('../utils/Utils').camelCaseToRegular

var resourceIcons = {
  "chart": "icon-icon_chart",
  "table": "icon-icon_table",
  "plantList": "icon-icon_plantlist",
  "citation": "icon-icon_link",
  "caseStudy": "icon-icon_casestudy",
  "image": "icon-icon_image",
  "diagram": "icon-icon_diagram"
}

var Resources = React.createClass({

    renderResources: function(resourceType){
      var resourceMarkup = []
      var tag = this.props.tag

      var resources = this.props.resources
      var resourceLinks = [];

      resources[resourceType].forEach( function(item){
        resourceLinks.push(<li><Link to={"/adapt/oakland/"+tag+"/"+resourceType+"/"+item.slug}>{item.name}</Link></li>)
      })

      resourceMarkup.push( <div><ul>{ resourceLinks }</ul></div> )

      return <Popover title={"Resources | "+ camelCaseToRegular(resourceType) }>{resourceMarkup}</Popover>
    },

    renderButton: function(resourceType){
      var popover = this.renderResources( resourceType )
      return(
        <div>
          <OverlayTrigger rootClose={true} trigger="click" placement="top" overlay={ popover }>
            <Button className="btn btn-xs btn-success">
              <Icon fill="rgba(0,0,0,0.5)" symbolID={resourceIcons[resourceType]}/>
            </Button>
          </OverlayTrigger>
          <label>{ camelCaseToRegular(resourceType) }</label>
        </div>
      )
    },

    render: function(){
      var self = this;

      var resourceMarkup;
      if( this.props.resources ){
        resourceMarkup = Object.keys(this.props.resources).map( function(resourceType){
          if( self.props.resources[resourceType].length > 0 ){
            return self.renderButton(resourceType)
          }else{
            return false
          }
        });
      }


      return (
        <Grid id="resources" fluid={true}>
          <h3>Resources</h3>
          { resourceMarkup }
        </Grid>
      )

    }
});

module.exports = Resources