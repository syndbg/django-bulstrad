'use strict';

angular.module('djangoBulstradApp')
  .factory('HospitalType', ['$resource', 'Constants',
    function($resource, Constants) {
      return $resource(Constants.HOSPITALS_TYPES_API_URL, {id: '@id'});
  }
]);
