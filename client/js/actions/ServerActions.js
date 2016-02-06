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
  },

  receivePlantLists: function( plantLists ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_PLANT_LISTS",
      plantLists: plantLists
    });
  },

  receiveCitations: function( citations ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_CITATIONS",
      citations: citations
    });
  },

  receiveCaseStudies: function( caseStudies ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_CASE_STUDIES",
      caseStudies: caseStudies
    });
  },

  receiveImages: function( images ) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_IMAGES",
      images: images
    });
  }

};