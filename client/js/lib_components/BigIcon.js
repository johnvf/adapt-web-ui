var React = require('react');
var BigIcon = React.createClass({

	render: function() {
	    var symbolID = this.props.symbolID
	    var className = this.props.className
	    var useTag = '<use xlink:href="img/ao_process.svg#'+symbolID+'" />';
	    return <svg className={className} viewBox="0 0 1 1" dangerouslySetInnerHTML={{__html: useTag }} />;
	}

});

module.exports = BigIcon;