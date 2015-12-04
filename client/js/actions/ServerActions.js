var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  receiveTags: function( tags ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_TAGS",
      tags: tags
    });
  },

  receiveMaps: function( map_list ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_MAPS",
      map_list: map_list
    });
  },

  receiveText: function( text ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_TEXT",
      text: text
    });
  },

  receiveCharts: function( charts ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_CHARTS",
      charts: charts
    });
  },

  receiveTables: function( tables ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_TABLES",
      tables: tables
    });
  }

};