var React = require('react');

// NOTE: Depends on addthis widget being included in script tag in index.html
var Icon = require('../lib_components/Icon');
var Header = React.createClass({

	componentDidMount: function(){
    	if (!window.addthis.toolbox) window.addthis.init() 
    	window.addthis.toolbox('.addthis_toolbox')
	},

	render: function() {
	    var pageTitle = this.props.pageTitle || "";
	    var pageIcon = this.props.pageIcon || "";
	    console.log(pageIcon)
	    return (
	    	<div id="header">
				<Icon symbolID= {pageIcon}/>
	    		<h1>{pageTitle}</h1>
	    		<div className="addthis_toolbox addthis_default_style">
				    <a className="addthis_button_preferred_1"></a>
				    <a className="addthis_button_preferred_2"></a>
				    <a className="addthis_button_preferred_3"></a>
				    <a className="addthis_button_preferred_4"></a>
				    <a className="addthis_button_compact"></a>
				    // <a className="addthis_counter addthis_bubble_style"></a>s
	    		</div>

	    	</div>
	    )
	}
});

module.exports = Header;


