var React = require('react');


function data2Table( array ){
    var th = []
    var td = []

    for(var i = 0; i < array.length; i++){
        row = array[i]
        
        if( i == 0 ){
            var th_cells = []
            for( var j = 0; j < row.length; j++ ){
                if( j == 0){
                    th_cells.push( <th></th> )
                }
                else{
                    th_cells.push( <th>{row[j]}</th> )
                }
            }
            th.push( <tr>{ th_cells }</tr>)
        }
        else{
            var tr_cells = []
            for( var j = 0; j < row.length; j++ ){
                tr_cells.push( <td>{row[j]}</td> )
            }
            td.push( <tr>{ tr_cells }</tr> )
        }
    }

    return (
        <table className="table">
            <thead>
              {th}
            </thead>
            <tbody>
              {td}
            </tbody>
        </table>
    )
}

var Table = React.createClass({

    render: function(){

        var tableMarkup = data2Table( this.props.item.data )

        return (
            <div id={this.props.id} className="table-responsive"  style={ { overflow: "auto", width: "100%", height: "100%", fontSize: "small"} }>
                { tableMarkup }
            </div>
        )
    }
});

module.exports = Table