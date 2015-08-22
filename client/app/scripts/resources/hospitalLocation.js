'use strict';

angular.module('djangoBulstradApp')
  .factory('HospitalLocation', ['$resource', 'Constants',
    function($resource, Constants) {
      return $resource(Constants.HOSPITALS_LOCATIONS_API_URL, {id: '@id'});
  }
]);
