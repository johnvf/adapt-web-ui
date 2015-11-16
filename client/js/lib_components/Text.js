var React = require('react');
var marked = require('marked');

var Text = React.createClass({

    render: function(){
        return <div id={this.props.id}  dangerouslySetInnerHTML={ { __html: marked(this.props.item.body) } }/>
    }
});

module.exports = Text