'use strict';

describe('Service: potato', function () {

  // load the service's module
  beforeEach(module('djangoBulstradApp'));

  // instantiate service
  var potato;
  beforeEach(inject(function (_potato_) {
    potato = _potato_;
  }));

  it('should do something', function () {
    expect(!!potato).toBe(true);
  });

});
