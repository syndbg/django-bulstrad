'use strict';

/**
 * @ngdoc function
 * @name djangoBulstradApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the djangoBulstradApp
 */
angular.module('djangoBulstradApp')
  .controller('MapCtrl', ['$scope', 'Constants', 'locations',
  function ($scope, Constants, locations) {
    $scope.center = Constants.MAP_CENTER;
    $scope.zoom = Constants.MAP_ZOOM;

    _.map(locations, createMarker)
    $scope.markers = locations;

    function createMarker(item) {
      var marker = {
        id: item.id,
        coords: {
          latitude: item.latitude,
          longitude: item.longitude
        }
      };
      item = marker
    }
  }]);
