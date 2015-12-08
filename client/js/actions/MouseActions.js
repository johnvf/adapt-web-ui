// MouseActions.js

var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  featureHover: function( e, features ) {
    AppDispatcher.handleViewAction({
      type: "FEATURE_HOVER",
      e: e,
      features: features
    });
  },

}
