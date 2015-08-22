'use strict';

/**
 * @ngdoc service
 * @name djangoBulstradApp.constants
 * @description
 * # Constants
 * Constant in the djangoBulstradApp.
 */

angular.module('djangoBulstradApp')
  .constant('Constants', {
    NO_MARK: '✗',
    YES_MARK: '√',

    MAP_CENTER: {
      latitude: 42.7000,
      longitude: 23.3333
    },
    MAP_ZOOM: 12
  }
);
