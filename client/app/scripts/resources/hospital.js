'use strict';

angular.module('djangoBulstradApp')
  .factory('Hospital', ['$resource', 'Constants',
    function($resource, Constants) {
      return $resource(Constants.HOSPITALS_API_URL, {id: '@id'});
  }
]);
