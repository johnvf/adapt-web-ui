var React = require('react');
var marked = require('marked');

var Text = React.createClass({

    render: function(){
        // console.log(this.props.body)
        var text = !this.props.body ? "" : this.props.body.map(function(textItem){ return textItem.data }).join("\n");

        return (
            <div id="data">
                <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.props.toggleView}>
                  <span className="glyphicon glyphicon-resize-full" aria-hidden="true" ></span>
                </button>
                <hr/>
                <div className="body"  dangerouslySetInnerHTML={ { __html: marked(text) } }/>
            </div>
        )
    }
});

module.exports = Text