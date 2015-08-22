'use strict';

/**
 * @ngdoc service
 * @name djangoBulstradApp.constants
 * @description
 * # Constants
 * Constant in the djangoBulstradApp.
 */

var API_URL = 'http://localhost:8000/api/';
var JSON_SUFFIX = '?format=json';

angular.module('djangoBulstradApp')
  .constant('Constants', {
    API_URL: API_URL,
    JSON_SUFFIX: JSON_SUFFIX,

    HOSPITALS_API_URL: API_URL + 'hospitals/:id/' + JSON_SUFFIX,
    HOSPITALS_LOCATIONS_API_URL: API_URL + 'hospitals_locations/:id/' + JSON_SUFFIX,
    HOSPITALS_TYPES_API_URL: API_URL + 'hospitals_types/:id/' + JSON_SUFFIX,

    MAP_CENTER: {
      latitude: 42.7000,
      longitude: 23.3333
    },
    MAP_ZOOM: 11.5
  }
);
