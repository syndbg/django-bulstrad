'use strict';

angular.module('djangoBulstradApp')
  .factory('Hospital', ['Restangular',
    function(Restangular) {
      return Restangular.service('hospitals');
  }
]);
