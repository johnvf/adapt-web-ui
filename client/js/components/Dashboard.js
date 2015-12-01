var React = require('react');
// Some considerations with grid layout:
// - What do we do if the user makes a layout, then adds an additional widget without redoing the layout?
// - Standard keys vs. custom keys? Maybe custom keys, since they're more explicit?
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;

var Image = require('../lib_components/Image');
var Table = require('../lib_components/Table');
var Chart = require('../lib_components/Chart');

var Dashboard = React.createClass({

  getDefaultProps: function() {
    return {
      className: "layout",
      view: "map",
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      rowHeight: 30,
      verticalCompact: false
    };
  },

  getInitialState: function(){
    return { layoutChangeCallbacks: [] , layouts: this.generateLayout( this.props.view )}
  },

  generateLayout: function ( view ) {
    switch ( view ) {
        case "map":
          return ({
            lg: [
              { "w": 9, "h": 22, "x": 0, "y": 3, "i": "0" },
              { "w": 3, "h": 11, "x": 9, "y": 3, "i": "1" },
              { "w": 3, "h": 11, "x": 9, "y": 14, "i": "2" }
            ],
            md: [
              { "w": 8, "h": 22, "x": 0, "y": 3, "i": "0" },
              { "w": 2, "h": 11, "x": 8, "y": 3, "i": "1" },
              { "w": 2, "h": 11, "x": 8, "y": 14, "i": "2" }
            ],
            sm: [
              { "w": 4, "h": 22, "x": 0, "y": 3, "i": "0" },
              { "w": 2, "h": 11, "x": 4, "y": 3, "i": "1" },
              { "w": 2, "h": 11, "x": 4, "y": 14, "i": "2" }
            ]
          });
          break

        case "data":
          return ({
            lg: [
              {"w": 3, "h": 14, "x": 0, "y": 3, "i": "0" },
              {"w": 9, "h": 22, "x": 3, "y": 3, "i": "1" },
              {"w": 3, "h": 8, "x": 0, "y": 17, "i": "2" }
            ],
            md: [
              {"w": 2, "h": 14, "x": 0, "y": 3, "i": "0" },
              {"w": 8, "h": 22, "x": 3, "y": 3, "i": "1" },
              {"w": 2, "h": 8, "x": 0, "y": 17, "i": "2" }
            ],
            sm: [
              {"w": 2, "h": 14, "x": 0, "y": 3, "i": "0" },
              {"w": 4, "h": 22, "x": 3, "y": 3, "i": "1" },
              {"w": 2, "h": 8, "x": 0, "y": 17, "i": "2" }
            ]
          });
          break

        default:
          break
        }
  },

  // Allow widgets to hook into the onLayoutChange event
  // FIXME: This shouldn't be necessary - prop updates should work too
  subscribeToLayoutChange: function( callback ){
    this.state.layoutChangeCallbacks.push( callback )
  },


  onLayoutChange: function(layout, layouts) {    
    // Execute widget callbacks
    // FIXME: This shouldn't be necessary - prop updates should work too
    this.state.layoutChangeCallbacks.forEach( function(callback){
      callback();
    })
  },

  componentWillReceiveProps: function(nextprops){
    this.setState({layouts: this.generateLayout( nextprops.view )})
  },

  getWidgets: function( content ){
    var self = this;
    // var widgets = [
    //   ( <div key={0} className="widget">FOO</div> ),
    //   ( <div key={1} className="widget">BAR</div> ),
    //   ( <div key={2} className="widget">BAZ</div> )
    // ]

    var widgets = content.map( function(component, index){
      return( <div key={index} className="widget">{component}</div> )
    })
    return widgets
  },

  render: function(){

      var widgets = this.getWidgets( this.props.content );

      // {lg: layout1, md: layout2, ...}
      return (    
        <ResponsiveReactGridLayout className="layout"
          {...this.props}
          isDraggable={false} 
          isResizable={false}
          layouts={this.state.layouts}
          onLayoutChange={this.onLayoutChange}>
          {widgets}
        </ResponsiveReactGridLayout>
      )      
  }

});


module.exports = Dashboard