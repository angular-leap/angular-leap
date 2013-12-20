describe('A leapConfiguration', function () {

  /* Test basic configurations */
  var leapConfig,
    testBasicConfiguration = {
      defaultTimeout: 650,
      gestureIntense: 0.5
    };

  beforeEach(module('angularLeap'));
  beforeEach(inject(function (_leapConfig_) {
    leapConfig = _leapConfig_;
  }));

  it('should set new values via argument', function () {
    expect(leapConfig().anyNewValue).toBeUndefined();
    leapConfig({
      anyNewValue: 0
    });
    expect(leapConfig().anyNewValue).toBeDefined();
  });


  it('should merge argument object into config', function () {
    var value = leapConfig().defaultTimeout;
    expect(value).toBeDefined();
    expect(leapConfig().anyNewValue).toBeUndefined();
    leapConfig({
      anyNewValue: 0
    });
    expect(leapConfig().anyNewValue).toBe(0);
    expect(leapConfig().defaultTimeout).toBe(value);
  });

  describe('key: defaultTimeout', function () {
    it('should define a defaultTimeout', function () {
      expect(leapConfig().defaultTimeout).toBeDefined();
    });

    it('should define a defaultTimeout at ' + testBasicConfiguration.defaultTimeout, function () {
      expect(leapConfig().defaultTimeout).toBe(testBasicConfiguration.defaultTimeout);
    });
  });

  describe('key: gestureIntense', function () {
    it('should define a gestureIntense function', function () {
      expect(leapConfig().gestureIntense).toBeDefined();
    });

    it('should define a default gestureIntense at ' + testBasicConfiguration.gestureIntense, function () {
      expect(leapConfig().gestureIntense).toBe(testBasicConfiguration.gestureIntense);
    });

  });


});




