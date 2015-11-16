var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  getMaps: function( tags ) {
    AppDispatcher.handleViewAction({
      type: "GET_MAPS",
      tags: tags
    });
  }

}