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
  'ngResource',
  'ngSanitize',
  'ngTouch',

  // 3rd-party
  'ui.router',
  'ui.grid',
  'uiGmapgoogle-maps'
])
.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
])
.config(['$stateProvider', '$urlRouterProvider', '$resourceProvider',
  function ($stateProvider, $urlRouteProvider, $resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;

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
        hospitals: ['Hospital', function (Hospital) {
            return Hospital.query().$promise;
        }],
        hospitalTypes: ['HospitalType', function (HospitalType) {
            return HospitalType.query().$promise;
        }],
        hospitalLocations: ['HospitalLocation', function (HospitalLocation) {
            return HospitalLocation.query().$promise;
        }],
      }
    });

    $stateProvider.state('map', {
      url: '/map',
      templateUrl: 'views/map.html',
      controller: 'MapCtrl',
      controllerAs: 'map'
    });
  }
]);
