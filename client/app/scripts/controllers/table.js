'use strict';

/**
 * @ngdoc function
 * @name djangoBulstradApp.controller:TableCtrl
 * @description
 * # TableCtrl
 * Controller of the djangoBulstradApp
 */
angular.module('djangoBulstradApp')
  .controller('TableCtrl', ['$scope', '$timeout', 'Constants', 'uiGridConstants', 'totalHospitals', 'Hospital', 'Restangular', 'hospitalLocations', 'hospitalTypes',
  function ($scope, $timeout, Constants, uiGridConstants, totalHospitals, Hospital, Restangular, hospitalLocations, hospitalTypes) {
    var START_PAGE = 1;
    var PAGE_SIZE = 500;

    var hospitalLocationsOptions = createOptions(hospitalLocations);
    var hospitalTypesOptions = createOptions(hospitalTypes);
    var helpOptions = [{value: Constants.NO_MARK, label: 'No'}, {value: Constants.YES_MARK, label: 'Yes'}];

    var paginationOptions = {
      pageNumber: START_PAGE,
      pageSize: PAGE_SIZE
    };

    $scope.gridOptions = {
      enableFiltering: true,
      useExternalFiltering: true,
      enableSorting: true,
      enableColumnResizing: true,

      paginationPageSizes: [25, 50, 75, 100, 150, 300, 500],
      paginationPageSize: PAGE_SIZE,

      useExternalPagination: true,

      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;

        $scope.gridApi.core.on.filterChanged($scope, function() {
          if (angular.isDefined($scope.filterTimeout)) {
            $timeout.cancel($scope.filterTimeout);
          }

          var grid = this.grid;
          $scope.filterTimeout = $timeout(function () {
            var filterCriteria = getFilterCriteria(grid.columns);

            Hospital.getList(filterCriteria).then(function (data) {
              $scope.gridOptions.data = data;
              _.map($scope.gridOptions.data, formatItem);
            });
          }, 500);
        });

        $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          paginationOptions.pageNumber = newPage;
          paginationOptions.pageSize = pageSize;
          setGridData(newPage, pageSize);
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

    setGridData(START_PAGE, PAGE_SIZE);

    $scope.$on('$destroy', function (event) {
      if (!_.isUndefined($scope.filterTimeout)) {
        $timeout.cancel($scope.filterTimeout);
      }
    });

    $scope.toggleFiltering = function(){
      $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    function setGridData(page, page_size) {
      Hospital.getList({page: page, page_size: page_size}).then(function (data) {
        $scope.gridOptions.totalItems = totalHospitals;
        $scope.gridOptions.data = data;
        _.map($scope.gridOptions.data, formatItem);
      });
    }

    function getFilterCriteria(columns) {
      var column = _.find(columns, function (column) {
        // only one filter per column, so it's ok to check length
        return column.filters.length > 0 &&
               !_.isUndefined(column.filters[0]['term']);
      });

      var criteria = {};
      criteria[column.colDef.field] = column.filters[0].term
      return criteria
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
        return row.entity[cell_name];
      };
    }

    function headerTooltip(col) {
      return col.displayName;
    }

    // TODO: Move this to a filter when I stop
    // getting <filtername>FilterProvider errors.
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
}]);
