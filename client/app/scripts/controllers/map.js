'use strict';

/**
 * @ngdoc function
 * @name djangoBulstradApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the djangoBulstradApp
 */
angular.module('djangoBulstradApp')
.controller('MapCtrl', ['$scope', '$http', '$timeout', 'Constants', 'HospitalType', 'Hospital', 'HospitalLocation',
  function ($scope, $http, $timeout, Constants, HospitalType, Hospital, HospitalLocation) {
    $scope.center = Constants.MAP_CENTER;
    $scope.locations = []
    $scope.hospitals = [];
    $scope.type = {};
    $scope.zoom = Constants.MAP_ZOOM;

    $scope.refreshTypes = createRefreshFunction(HospitalType, 'type_id', 'types');
    $scope.refreshLocations = createRefreshFunction(HospitalLocation, 'location_id', 'locations');

    $scope.clear = function() {
      $scope.type.selected = undefined;
    };

    $scope.updateMarkers = function () {
      var criteria = {
        type: $scope.type.id
      };

      console.log(criteria);
      setHospitals();
    };

    function createRefreshFunction(restangularModel, criteria_name, scope_property) {
      return function (criteria_value) {
        var criteria = {};
        criteria[criteria_name] = criteria_value;
        return restangularModel.getList(criteria).then(function (data) {
          $scope[scope_property] = data;
        });
      };
    }

    function setHospitals(criteria) {
      return Hospital.getList(criteria).then(function (data) {
        console.log(data);
        $scope.hospitals = data;
      });
    }
  }
]);
