var React = require('react');
var marked = require('marked');

// function urlify(text) {
//     var urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.split(urlRegex).map( function(token, i) {
//         if( token.match(urlRegex) ){
//           var clean_url = token.replace(/^[.\s]+|[.\s]+$/g, "");
//           return (<a href={clean_url}> { token } </a>);
//         }
//         else{
//           return ( token );
//         }
//     })
// }

var Panel = React.createClass({

  render: function(){
    var body;

    if( this.props.body ){
      // body = (
      //   <div className="panel-body">
      //     { urlify(this.props.body) }
      //   </div>
      // )
      body = (
        <div className="panel-body" dangerouslySetInnerHTML={ { __html: marked(this.props.body) } }/>
        )
    }
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.heading}</div>
        { body }
        { this.props.children }
      </div>
      )
  }

});

module.exports = Panel