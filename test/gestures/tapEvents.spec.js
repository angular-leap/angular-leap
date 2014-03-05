describe("A Tap gesture directive", function () {

  beforeEach(module("angularLeap"));

  var tapType = ['key', 'screen'];

  var _Leap;
  var _LeapController;

  beforeEach(inject(function ($window) {
    _LeapController = function () {
    };
    _LeapController.prototype.connect = function () {
    };
    _LeapController.prototype.on = function () {
    };
    _LeapController.prototype.removeListener = function () {
    };


    _Leap = function () {
    };
    _Leap.Controller = _LeapController;

    $window.Leap = _Leap;
  }));


  angular.forEach(tapType, function (type) {
    it("should be executed and register " + type + "Tap gesture event listener ", inject(function ($rootScope, $compile) {
      spyOn(_LeapController.prototype, "connect");
      spyOn(_LeapController.prototype, "on");

      var html = "<div leap-" + type + "-tap='test=test+1'></div>";
      var scope = $rootScope.$new();
      var element = $compile(html)(scope);

      expect(_LeapController.prototype.connect).toHaveBeenCalled();
      expect(_LeapController.prototype.on).toHaveBeenCalled();
      expect(_LeapController.prototype.on.calls[0].args[0]).toEqual("gesture");
    }));

    //TODO: Write generic tesFOrDirection func to reduce redundant code
    it("should be executed and register gesture event listener for left", inject(function ($rootScope, $compile) {


      spyOn(_LeapController.prototype, "on");
      var html = "<div leap-" + type + "-tap='test=test+1'></div>";
      var scope = $rootScope.$new();
      var element = $compile(html)(scope);
      spyOn(scope, "$apply");
      // Simulate Swipe Event, execute function
      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap"
      });
      expect(scope.$apply).toHaveBeenCalled();
    }));


    it("should use the timeout function to prevent unwanted double event triggers", inject(function ($rootScope, $compile, $timeout) {
      spyOn(_LeapController.prototype, "on");


      var html = "<div leap-" + type + "-tap='test=test+1'></div>";
      var scope = $rootScope.$new();
      var element = $compile(html)(scope);


      spyOn(scope, "$apply");
      // Simulate Swipe Event, execute function
      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap"
      });
      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap"
      });

      expect(scope.$apply.calls.length).toBe(1);


      $timeout.flush()

      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap",
        direction: [1, 0]
      });

      expect(scope.$apply.calls.length).toBe(2);
    }));


    it("should execute expressions", inject(function ($rootScope, $compile) {
      spyOn(_LeapController.prototype, "on");

      var html = "<div leap-" + type + "-tap='test=test+1'></div>";
      var scope = $rootScope.$new();
      var element = $compile(html)(scope);

      scope.test = 1;

      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap"
      });

      expect(scope.test).toBe(2);
    }));

    it("should execute scope function", inject(function ($rootScope, $compile) {
      var scope = $rootScope.$new();
      scope.testFunction = function () {
      };
      spyOn(scope, "testFunction");
      spyOn(_LeapController.prototype, "on");

      var html = "<div leap-" + type + "-tap='testFunction()'></div>";
      var element = $compile(html)(scope);

      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap"
      });

      expect(scope.testFunction).toHaveBeenCalled();
    }));


    it("should use defaultTimeout of not configured via attribute", inject(function ($rootScope, $compile, $browser, leap) {
      spyOn($browser, "defer");
      spyOn(_LeapController.prototype, "on");
      var scope = $rootScope.$new();
      var html = "<div leap-" + type + "-tap='testFunction()'></div>";
      var element = $compile(html)(scope);

      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap"
      });

      expect($browser.defer.calls[0].args[1]).toBe(leap.config().defaultTimeout);
    }));

    it("should use timeout if it configured", inject(function ($rootScope, $compile, $browser) {
      spyOn($browser, "defer");
      spyOn(_LeapController.prototype, "on");
      var scope = $rootScope.$new();
      var html = "<div leap-" + type + "-tap='testFunction()' leap-timeout='1000'></div>";
      var element = $compile(html)(scope);

      _LeapController.prototype.on.calls[0].args[1]({
        type: type + "Tap"
      });

      expect($browser.defer.calls[0].args[1]).toBe('1000');
    }));

  });


});
