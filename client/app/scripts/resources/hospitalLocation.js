'use strict';

angular.module('djangoBulstradApp')
  .factory('HospitalLocation', ['Restangular',
    function(Restangular) {
      return Restangular.service('hospitals_locations');
  }
]);
