var React = require('react');
var marked = require('marked');

var History = require('react-router').History;
var Loader = require('react-loader');

var renderer = new marked.Renderer();

// FIXME: This sort of attribute processing should really be done by the importer, not live in the client.
renderer.heading = function (text, level) {

  var escapedText =  text.replace(/<(?:.|\n)*?>/gm, '').toLowerCase().split(/[^\w]+/g).join('_');

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
      if(!!tag){
        url = url.split("#")[0] + "#" + tag;
      }

      // FIXME: For some reason, this is needed  
      // for navigating hashtag URLS w/ react router
      if( url.split("#").length > 1 ){
        setTimeout(function(){
          window.location = (url) 
        },500)
      }

      this.history.pushState(null, url);
    },

    componentDidMount: function(){
      var self = this;
      setTimeout( function(){
        self.processLinks();
      },50)
    },

    shouldComponentUpdate: function(nextProps){
      return this.props.body != nextProps.body
    },

    componentDidUpdate: function(){
      this.processLinks();
    },

    processLinks: function(){
      var markup = React.findDOMNode(this.refs.text);

      if( markup ){
        var links = markup.querySelectorAll('[href]')
        var self = this;

        // Intercept navigation and use history instead
        for( var i=0; i < links.length; i++){
          var link = links[i]
          link.addEventListener("click", function(e){
            e.preventDefault();

            // Sometimes, Mammoth.js nests embeds a STRONG tag 
            // which receives the click event. 
            // This should reliably get the clicked anchor tag
            el = e.target.href ? e.target : e.target.parentElement

            if( !!el.href ){
              // If navigation is local to the site, handle with react router
              // Else, set window location
              if ( el.hostname == window.location.hostname ){
                e.preventDefault();
                var target = (el.pathname + el.hash).toLowerCase();
                self.navigate(target)
              }
              else{
                // window.location.assign(e.target.href)
                window.open( e.target.href,'_blank');
              }

            }
          });
        }
      }

    },

    render: function(){
      var html = !!this.props.body ? marked(this.props.body, {renderer: renderer}) : ""
      return(
        <Loader loaded={!!this.props.body}>
          <div ref="text" id={this.props.id} className={this.props.className} dangerouslySetInnerHTML={ { __html: html } }/>
        </Loader>
      )
    }
});

module.exports = Text