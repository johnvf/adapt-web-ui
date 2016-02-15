/**
 * Mouse Actions
 *
 * Description....
 * client/js/actions/MouseActions.js
 * @module client/actions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  /** Hover event from Map.
   * @fires FEATURE_HOVER
   * @param {e} e - the native hover event
   * @param {features} e - the hovered features
   * @see  module:client/stores.receiveHover
   */
  featureHover: function( e, features ) {
    AppDispatcher.handleViewAction({
      type: "FEATURE_HOVER",
      e: e,
      features: features
    });
  },

}
