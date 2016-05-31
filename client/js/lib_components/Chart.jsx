var React = require('react');

var c3 = require('c3')

var Chart = React.createClass({
    // ...
    _renderChart: function (item) {
        // Copy the data - should use immutable.js instead?
        var rItem = JSON.parse(JSON.stringify(item))

        // Modify config and insert data where c3 expects it
        rItem.config.bindto = '#'+this.props.id
        rItem.config.data.rows = rItem.data

        // Remove groups so they can be added later, to animate them
        var groups = rItem.config.data.groups
        delete( rItem.config.data.groups )

        this.chart = c3.generate( rItem.config )

        var self = this;

        setTimeout(function () {
            self.chart.groups( groups )
        }, 1500);
    },

    componentDidMount: function () {
        // console.log(this.props.item);
        var self = this;
        if ( !!this.props.item ){
            // try {
                this._renderChart(this.props.item);
            // }
            // catch(err) {
            //     alert( "Incorrect data for chart "+this.props.id+": " + err)
            // }
        }

        // FIXME: This shouldn't be necessary - prop updates should work too
        if (this.props.subscribeToLayoutChange){
            this.props.subscribeToLayoutChange( function(){ 
                if( self.chart ){
                    self.chart.resize()                 
                }
            }) 
        }

    },


    componentWillReceiveProps: function (newProps) {
        // TODO: Update graph data if new data is loaded.
        // this would allow the graph to be dynamic..
        // if( !!newProps.item ){
        //     try {
        //         this._renderChart(newProps.item);
        //     }
        //     catch(err) {
        //         alert( "Incorrect data for chart "+this.props.id+": " + err)
        //     }  
        // }

    },

    render: function(){
        return <div id={this.props.id}/>
    }
});

module.exports = Chart