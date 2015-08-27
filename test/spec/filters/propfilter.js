'use strict';

describe('Filter: propFilter', function () {

  // load the filter's module
  beforeEach(module('djangoBulstradApp'));

  // initialize a new instance of the filter before each test
  var propFilter;
  beforeEach(inject(function ($filter) {
    propFilter = $filter('propFilter');
  }));

  it('should return the input prefixed with "propFilter filter:"', function () {
    var text = 'angularjs';
    expect(propFilter(text)).toBe('propFilter filter: ' + text);
  });

});
