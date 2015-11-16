var React = require('react');

var Panel = require('../lib_components/Panel')
var ListGroup = require('../lib_components/ListGroup')
var Link = require('react-router').Link;

var Project = React.createClass({

  render: function() {

    var project = this.props.project;

    var project_id = project.project_id

    var heading = project.config.properties.name;
    var body = project.config.properties.body
    var items = Object.keys(project.config.reports).map( function(report_id){

      var report_heading = project.config.reports[report_id].title

      return( <Link to={ "/project/"+project_id+"/"+report_id }>{ report_heading}</Link>)
    })

    return (
      <Panel heading={ heading } body={ body } >
        <ListGroup>
          {items}
        </ListGroup>
      </Panel>
    )
  }

});

module.exports = Project