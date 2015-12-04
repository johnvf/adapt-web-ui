var React = require('react');
var Icon = require('../lib_components/Icon');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var Resources = React.createClass({

    render: function(){
       
        return (
            <Grid id="resources">
              <Row>
                <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_chart"/>
                N Charts
              </Row>
              <Row>
                <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_casestudy"/>
                N Case Studies
              </Row>
              <Row>
                <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_plantlist"/>
                N Plant Lists
              </Row>
              <Row>       
                <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_image"/>
                N Images
              </Row>
              <Row>
                <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_diagram"/>
                N Diagrams
              </Row>
              <Row>
                <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_link"/>
                N Links
              </Row>
            </Grid>
        )
    }
});

module.exports = Resources