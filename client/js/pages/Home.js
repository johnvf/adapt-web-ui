var React = require('react');

var Loader = require('react-loader');

var Icon = require('../lib_components/Icon');

var Home = React.createClass({

  /**
   * State Boilerplate 
   */

  render: function() {


    return (
      
        <div className="container-fluid bg-green" >
          <Loader loaded={true}>
            <div className="row">
              <div className="col-md-3"></div>            
              <div className="col-md-3"></div>
              <div className="col-md-3">
                <h1 className="left">ADAPT</h1>
                <h3 className="left">AN ECOSYSTEM SERVICES MODEL</h3>               
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.</p> 
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.</p>               
                </div>
              <div className="col-md-3">
                <div className="row bg-light home-options">
                  <div className= "home-heading">
                    <Icon className ="options-icon" symbolID="icon-icon_toolbox"/>
                    <h3 className ="options-heading"> ADAPT <br /> TOOLBOX</h3>
                      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.</p> 
                  </div>
                </div>
                <div className="row bg-light home-options">
                  <div className= "home-heading">
                    <Icon className ="options-icon"  symbolID="icon-icon_map"/>
                    <h3 className ="options-heading" > ADAPT <br /> OAKLAND</h3>
                      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.</p> 
                  </div>
                </div>
              </div>
            </div>           
          </Loader>
        </div>
    );
  }
});

module.exports = Home;