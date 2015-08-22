'use strict';

/**
 * @ngdoc function
 * @name djangoBulstradApp.controller:TableCtrl
 * @description
 * # TableCtrl
 * Controller of the djangoBulstradApp
 */
angular.module('djangoBulstradApp')
  .controller('TableCtrl', ['$scope', 'Constants', 'uiGridConstants', 'hospitals', 'hospitalLocations', 'hospitalTypes',
  function ($scope, Constants, uiGridConstants, hospitals, hospitalLocations, hospitalTypes) {
    // TODO: Move this to a filter when I stop
    // getting <filtername>FilterProvider errors.
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

      item.hospital_help = item.hospital_help ? Constants.YES_MARK : Constants.NO_MARK;
      item.out_of_hospital_help = item.out_of_hospital_help ? Constants.YES_MARK : Constants.NO_MARK;
      item.laboratory_help = item.laboratory_help ? Constants.YES_MARK : Constants.NO_MARK;
    }

    // TODO: Move this to a filter when I stop
    // getting <filtername>FilterProvider errors.
    function createOptions(values) {
      return _.map(values, function (value) {
        return { value: value.name, label: value.name };
      });
    }

    // TODO: Ask in Github issues
    // why this is not default behavior or availabel as a boolean option
    function createCellTooltip(cell_name) {
      return function(row, col) {
        return row.entity.name;
      };
    }

    function headerTooltip(col) {
      return col.displayName;
    }

    var hospitalLocationsOptions = createOptions(hospitalLocations);
    var hospitalTypesOptions = createOptions(hospitalTypes);
    var helpOptions = [{value: Constants.NO_MARK, label: 'No'}, {value: Constants.YES_MARK, label: 'Yes'}];

    $scope.gridOptions = {
      enableFiltering: false,
      enableSorting: true,
      enableColumnResizing: true,

      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sort) {
          $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        });
      },

      columnDefs: [
        {field: 'location', name: 'Location',
          filter: {type: uiGridConstants.filter.SELECT, selectOptions: hospitalLocationsOptions},
          cellTooltip: createCellTooltip('location'), headerTooltip: headerTooltip
        },
        {field: 'type', name: 'Type',
          filter: {type: uiGridConstants.filter.SELECT, selectOptions: hospitalTypesOptions},
          cellTooltip: createCellTooltip('type'), headerTooltip: headerTooltip
        },
        {field: 'name', name: 'Name', cellTooltip: createCellTooltip('name'), headerTooltip: headerTooltip},
        {field: 'address', name: 'Address', cellTooltip: createCellTooltip('address'), headerTooltip: headerTooltip},
        {field: 'url', name: 'URL', visible: false},
        {field: 'hospital_help', name: 'Hospital insurance',
          filter: {type: uiGridConstants.filter.SELECT, selectOptions: helpOptions},
          cellTooltip: createCellTooltip('hospital_help'), headerTooltip: headerTooltip
        },
        {field: 'out_of_hospital_help', name: 'Out of hospital insurance',
          filter: {type: uiGridConstants.filter.SELECT, selectOptions: helpOptions},
          cellTooltip: createCellTooltip('out_of_hospital_help'), headerTooltip: headerTooltip
        },
        {field: 'laboratory_help', name: 'Laboratory insurance',
          filter: {type: uiGridConstants.filter.SELECT, selectOptions: helpOptions},
          cellTooltip: createCellTooltip('laboratory_help'), headerTooltip: headerTooltip
        },
      ]
    };

    $scope.gridOptions.data = hospitals;

    $scope.toggleFiltering = function(){
      $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };
}]);
