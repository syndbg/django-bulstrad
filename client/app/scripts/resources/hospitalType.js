'use strict';

angular.module('djangoBulstradApp')
  .factory('HospitalType', ['Restangular',
    function(Restangular) {
      return Restangular.service('hospitals_types');
  }
]);
