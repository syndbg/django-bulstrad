'use strict';

/**
 * @ngdoc function
 * @name djangoBulstradApp.controller:TableCtrl
 * @description
 * # TableCtrl
 * Controller of the djangoBulstradApp
 */
angular.module('djangoBulstradApp')
  .controller('TableCtrl', ['$scope', 'uiGridConstants', 'hospitals',
  function ($scope, uiGridConstants, hospitals) {
    _.map(hospitals, formatItem);

    function formatItem(item) {
      if ('location' in item) {
        if (_.isObject(item.location) && 'name' in item.location) {
          item.location = item.location.name;
        } else {
          item.location = '';
        }
      }
      if ('type' in item) {
        if (_.isObject(item.type) && 'name' in item.type) {
          item.type = item.type.name;
        } else {
          item.type = '';
        }
      }

      item.hospital_help = item.hospital_help ? '√' : '';
      item.out_of_hospital_help = item.out_of_hospital_help ? '√' : '';
      item.laboratory_help = item.laboratory_help ? '√' : '';
    }

    $scope.gridOptions = {
      enableFiltering: false,
      enableSorting: true,
      enableColumnResizing: true,
      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        // default
        {field: 'name', name: 'Name', headerCellClass: $scope.highlightFilteredHeader},
        {field: 'location', name: 'Location', headerCellClass: $scope.highlightFilteredHeader},
        {field: 'type', name: 'Type', headerCellClass: $scope.highlightFilteredHeader},
        {field: 'url', name: 'URL', visible: false},
        {field: 'hospital_help', name: 'Hospital insurance'},
        {field: 'out_of_hospital_help', name: 'Out of hospital insurance'},
        {field: 'laboratory_help', name: 'Laboratory insurance'},
      ]
    };

    $scope.gridOptions.data = hospitals;

    $scope.toggleFiltering = function(){
      $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };
}]);
