'use strict';

/**
 * @ngdoc overview
 * @name djangoBulstradApp
 * @description
 * # djangoBulstradApp
 *
 * Main module of the application.
 */
angular.module('djangoBulstradApp', [
  'ngAnimate',
  'ngCookies',
  'ngMessages',
  'ngRoute',
  'ngSanitize',
  'ngTouch',

  // 3rd-party
  'restangular',
  'ui.router',
  'ui.bootstrap',
  'ui.grid',
  'ui.select',
  'ui.grid.pagination',
  'uiGmapgoogle-maps'
])
.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
])
.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'uiSelectConfig',
  function ($stateProvider, $urlRouteProvider, RestangularProvider, uiSelectConfig) {
    $urlRouteProvider.otherwise('/');

    $stateProvider.state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    });

    $stateProvider.state('table', {
      url: '/table',
      templateUrl: 'views/table.html',
      controller: 'TableCtrl',
      controllerAs: 'table',
      resolve: {
        totalHospitals: ['Restangular', '$http', function (Restangular, $http) {
          // TODO: Replace this with proper Restangular URI build syntax
          var promise = $http.get(Restangular.configuration.baseUrl + '/hospitals/count/?format=json')
            .then(function (response) {
              return response.data.count;
            });
          return promise;
        }],
        hospitalTypes: ['HospitalType', function (HospitalType) {
          return HospitalType.getList();
        }],
        hospitalLocations: ['HospitalLocation', function (HospitalLocation) {
          return HospitalLocation.getList();
        }],
      }
    });

    $stateProvider.state('map', {
      url: '/maps?lat&lon',
      templateUrl: 'views/map.html',
      controller: 'MapCtrl',
      controllerAs: 'map'
    });

    // TODO: Move to an ENV variable the base URL
    RestangularProvider.setBaseUrl('http://localhost:8000/api/');
    RestangularProvider.setDefaultRequestParams({format: 'json'});
    // Note that this is hardcoded to the paginated responses!
    RestangularProvider.setResponseExtractor(function(response, operation) {
      return response.results;
    });

    // https://github.com/angular-ui/ui-select/wiki/ui-select#attributes
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
  }
]);
