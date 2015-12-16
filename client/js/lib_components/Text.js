var React = require('react');
var marked = require('marked');

var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  var escapedText =  text.toLowerCase().split(/[^\w]+/g).slice(3).join('_');

  return '<h' + level + '><a name="' +
                escapedText +
                 '" class="anchor" href="#' +
                 escapedText +
                 '"><span class="header-link"></span></a>' +
                  text + '</h' + level + '>';
}

var Text = React.createClass({

    render: function(){
        return <div id={this.props.id} className={this.props.className} dangerouslySetInnerHTML={ { __html: marked(this.props.body) } }/>
    }
});

module.exports = Text