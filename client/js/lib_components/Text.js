var React = require('react');
var marked = require('marked');

var History = require('react-router').History;

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

    mixins: [ History ],
    // This function has become hacky - 
    // need to find a better way to have react-router handle navigation.
    // FIXME: This code is also copy/pasted into the Sidebar widget
    navigate: function(url, tag){
      if(!url){
        url = window.location.pathname;
      }
      if(tag){
        url = url.split("#")[0] + "#" + tag;
      }
      // FIXME: For some reason, this works for navigating tags 
      // but not for the unadorned URL
      if( url.split("#").length > 1 ){
        window.location.assign(url) 
      }
      else{
        // While this works for the unadorned URL, but not for tags
        this.history.pushState(null, url);  
      }
    },

    componentDidUpdate: function(){
      var markup = React.findDOMNode(this.refs.text);

      var links = markup.querySelectorAll('[href]')
      var self = this;

      // Intercept navigation and use history instead
      for( var i=0; i < links.length; i++){
        var link = links[i]
        link.addEventListener("click", function(e){
          if( !!e.target.href ){
            e.preventDefault();
            self.navigate(e.target.pathname)
          }
        });
      }


    },

    render: function(){
        return <div ref='text' id={this.props.id} className={this.props.className} dangerouslySetInnerHTML={ { __html: marked(this.props.body, {renderer: renderer}) } }/>
    }
});

module.exports = Text