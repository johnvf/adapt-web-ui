var React = require('react');

var Image = React.createClass({

    render: function(){
        return (
            <div id={this.props.id} className="image-widget" >{ this.props.item.body }
                <img style={  { maxWidth: "100%", maxHeight: "100%"} } alt={this.props.item.caption} src={this.props.item.url}/>
                <div> {this.props.item.caption} </div>
            </div>
            ) 
    }
});

module.exports = Image