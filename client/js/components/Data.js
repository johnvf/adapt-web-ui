var React = require('react');
var marked = require('marked');

var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  var escapedText =  text.toLowerCase().split(/[^\w]+/g).slice(3).join('-');

  return '<h' + level + '><a name="' +
                escapedText +
                 '" class="anchor" href="#' +
                 escapedText +
                 '"><span class="header-link"></span></a>' +
                  text + '</h' + level + '>';
}

var Text = React.createClass({

    render: function(){
        // console.log(this.props.body)
        var text = !this.props.body ? "" : this.props.body.map(function(textItem){ return textItem.data }).join("\n");

        return (
            <div id="data">
                <button style={{position: 'fixed', top: '30px', right: '60px'}} type="button" className="btn btn-default" aria-label="Left Align" onClick={this.props.toggleView}>
                  <span className="glyphicon glyphicon-resize-full" aria-hidden="true" ></span>
                </button>
                <div className="body"  dangerouslySetInnerHTML={ { __html: marked(text, {renderer: renderer}) } }/>
            </div>
        )
    }
});

module.exports = Text