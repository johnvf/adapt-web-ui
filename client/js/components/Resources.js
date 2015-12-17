var React = require('react');
var Icon = require('../lib_components/Icon');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var Resources = React.createClass({

    render: function(){
       
        return (
            <Grid id="resources" fluid={true}>
              <Row>
                <Col xs={2} md={2}>
                  <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_chart"/>
                  <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_casestudy"/>
                  <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_plantlist"/>
                  <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_image"/>
                  <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_diagram"/>
                  <Icon fill="rgba(0,0,0,0.5)" className ="fill-black" symbolID="icon-icon_link"/>
                </Col>
                <Col xs={10} md={10}>
                  <div>Charts</div>
                  <div>Case Studies</div>
                  <div>Plant Lists</div>
                  <div>Images</div>
                  <div>Diagrams</div>
                  <div>Links</div>
                </Col>
              </Row>
            </Grid>
        )
    }
});

module.exports = Resources