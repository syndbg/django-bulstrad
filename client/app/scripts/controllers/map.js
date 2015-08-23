'use strict';

/**
 * @ngdoc function
 * @name djangoBulstradApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the djangoBulstradApp
 */
angular.module('djangoBulstradApp')
  .controller('MapCtrl', ['$scope', '$timeout', 'Constants', 'locations',
  function ($scope, $timeout, Constants, locations) {
    $scope.center = Constants.MAP_CENTER;
    $scope.zoom = Constants.MAP_ZOOM;

    $scope.markers = locations;
    // $scope.markers = [
    //   {
    //       latitude: 42.7000,
    //       longitude: 23.3333,
    //       icon: undefined,
    //       id: "7"
    //     },
    //     {
    //       latitude: 42.8000,
    //       longitude: 23.3333,
    //       icon: undefined,
    //       id: "10"
    //     }
    // ];
    // $scope.markers = [];
    // createMarkers(locations);
    // function createMarkers(locations) {
    //   _.each(locations, function (location) {
    //     var marker = {
    //       id: location.id,
    //       name: location.name,
    //       latitude: parseInt(location.latitude, 10),
    //       longitude: parseInt(location.longitude, 10)
    //     };
    //     $scope.markers.push(marker);
    //   });
    // }
  }]);
