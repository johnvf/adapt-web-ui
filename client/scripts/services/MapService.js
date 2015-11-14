'use strict';

function tags2filters( tags ){
    return tags.map( function(tag){
        return "filter[tags]="+tag
    }).join("&")
}

exports.inject = function(app) {
  app.factory('MapService', exports.factory);
  return exports.factory;
};

exports.factory = function($http, $resource) {

    // FIXME: How do I concatenate multiple ?filter[tags]=foo&filter[tags]=bar etc...
    var Map = $resource('/api/map/:id');

    Map.filter = function (tags, callback) {
        $http.get( ('/api/map?' + tags2filters( tags ) ) , null )
        .success(function (data, status, headers, config) {
            callback( data );
        })
    }

    return Map
};
