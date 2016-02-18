/**
 * @module client/js/actions/MouseActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  /**
   * Updates UserActionStore with hovered map features
   * @fires FEATURE_HOVER
   * @param {e} e - the native hover event
   * @param {features} e - the hovered features
   * @see  module:client/stores/UserActionStore
   */
  featureHover: function( e, features ) {
    AppDispatcher.handleViewAction({
      type: "FEATURE_HOVER",
      e: e,
      features: features
    });
  },

}
