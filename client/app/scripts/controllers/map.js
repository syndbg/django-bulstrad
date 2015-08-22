'use strict';

/**
 * @ngdoc function
 * @name djangoBulstradApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the djangoBulstradApp
 */
angular.module('djangoBulstradApp')
  .controller('MapCtrl', ['$scope', 'Constants', function ($scope, Constants) {
    $scope.map = { center: Constants.MAP_CENTER,
                   zoom: Constants.MAP_ZOOM };
  }]);
