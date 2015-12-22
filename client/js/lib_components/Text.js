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

    componentDidUpdate: function(){
      var markup = React.findDOMNode(this.refs.text);

      // Intercept navigation and use history instead
      markup.addEventListener("click", function(e){
        if( !!e.target.href ){
          e.preventDefault();
          console.log(e)

          // FIXME: This reloads the page if the base URL changes
          // React-Router should be intercepting this navigation...
          window.location.assign(e.target.href)
        }
      });
    },

    render: function(){
        return <div ref='text' id={this.props.id} className={this.props.className} dangerouslySetInnerHTML={ { __html: marked(this.props.body, {renderer: renderer}) } }/>
    }
});

module.exports = Text