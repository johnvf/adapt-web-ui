var React = require('react');

var c3 = require('c3')

function coerceNum( candidate ){
    if( typeof candidate === "string"){
        var num = parseFloat(candidate.replace(/[,$]+/g, ""))
        if( isNaN(num)){
            return candidate
        } else{
            return num
        }
    }
    else{
        return candidate
    }
}

function cleanData( data ){
    // console.log(data);
    data.forEach( function(row, i){
        row.forEach( function(col, j){
            data[i][j] = coerceNum( data[i][j] )
        })
    })
    // console.log(data);
    return data
}

var Chart = React.createClass({
    // ...
    _renderChart: function (item) {
        // save reference to our chart to the instance
        this.chart = c3.generate({
            bindto: '#'+this.props.id,
            data: {
                rows: cleanData( item.data ),
                x : 'x',
                type: item.chart_type,
                types: item.types
            },
            axis: {
                x: {
                    type: 'category'
                }
            }
        })

        var self = this;

        setTimeout(function () {
            self.chart.groups( item.groups )
        }, 1000);
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