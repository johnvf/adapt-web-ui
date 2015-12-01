var React = require('react');
var marked = require('marked');

var Text = React.createClass({

    render: function(){
        console.log(this.props.body)
        return <div id={this.props.id}  dangerouslySetInnerHTML={ { __html: marked(this.props.body) } }/>
        // return (<div>FOOO</div>)
    }
});

module.exports = Text