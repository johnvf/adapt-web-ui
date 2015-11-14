'use strict';

exports.inject = function(app) {
  app.directive('map', exports.directive);
  return exports.directive;
};

// TODO: It may make sense to mo
exports.directive = function() {
  return {
    restrict: 'E',
    template: '<ul id="map-ui"></ul><div id="map" class="leaflet-container leaflet-retina leaflet-fade-anim" tabindex="0"></div>',
  }
};
