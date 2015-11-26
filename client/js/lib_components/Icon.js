var React = require('react');
var Icon = React.createClass({

	render: function() {
	    var symbolID = this.props.symbolID
	    var useTag = '<use xlink:href="img/ao_icons.svg#'+symbolID+'" />';
	    return <svg viewBox="0 0 1 1" dangerouslySetInnerHTML={{__html: useTag }} />;
	}

});

module.exports = Icon;