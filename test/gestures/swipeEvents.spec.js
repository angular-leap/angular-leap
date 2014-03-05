describe("A swipe gesture directive", function () {
  // Test Values
  var directions = ["Left", "Right", "Up", "Down", "Forward", "Backward"],
    defaultEvent = {startPosition: [0, 0, 0], type: 'swipe'},
    testEventsFor = {
      left: [-1, 0, 0],
      right: [1, 0, 0],
      up: [0, 1, 0],
      down: [0, -1, 0],
      forward: [0, 0, 1],
      backward: [0, 0, -1]
    },
  // Leap Mock
    _Leap,
    _LeapController,
  // Services
    $rootScope,
    $compile,
    leap;

  beforeEach(module("angularLeap"));

  // Add Leap Mock to globals
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


  // Inject needed services
  beforeEach(inject(function (_$rootScope_, _$compile_, _leap_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    leap = _leap_;
  }));

  //TODO: Write generic tesFOrDirection func to reduce redundant code
  angular.forEach(directions, function (direction, index) {

    describe("leap-swipe-" + direction, function () {

      it("should be executed and register gesture event listener", inject(function (leap) {

        spyOn(leap,"onGesture");

        var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);

        expect(leap.onGesture).toHaveBeenCalled();
        expect(leap.onGesture.calls[0].args[0]).toBe("leapSwipe" + direction);
      }));


      it("should be executed and register gesture event listener for " + direction, inject(function () {


        spyOn(leap, "onGesture");
        var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);
        spyOn(scope, "$apply");
        // Simulate Swipe Event, execute function
        defaultEvent.position = testEventsFor[direction];
        leap.onGesture.calls[0].args[1](defaultEvent);
        expect(scope.$apply).toHaveBeenCalled();
      }));

      it("should use the timeout function to prevent unwanted double event triggers for " + direction, inject(function ($timeout) {
        spyOn(leap, "onGesture");


        var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);

        spyOn(scope, "$apply");
        // Simulate Swipe Event, execute function
        defaultEvent.position = testEventsFor[direction];
        leap.onGesture.calls[0].args[1](defaultEvent);
        leap.onGesture.calls[0].args[1](defaultEvent);
        expect(scope.$apply.calls.length).toBe(1);

        $timeout.flush();

        leap.onGesture.calls[0].args[1](defaultEvent);
        expect(scope.$apply.calls.length).toBe(2);
      }));


      it("should execute expressions", inject(function () {
        spyOn(leap, "onGesture");

        var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);

        scope.test = 1;

        defaultEvent.position = testEventsFor[direction];

        leap.onGesture.calls[0].args[1](defaultEvent);

        expect(scope.test).toBe(2);
      }));

      it("should execute scope function", inject(function () {
        var scope = $rootScope.$new();
        scope.testFunction = function () {
        };
        spyOn(scope, "testFunction");
        spyOn(leap, "onGesture");

        var html = "<div leap-swipe-" + direction + "='testFunction()'></div>";
        var element = $compile(html)(scope);

        defaultEvent.position = testEventsFor[direction];
        leap.onGesture.calls[0].args[1](defaultEvent);

        expect(scope.testFunction).toHaveBeenCalled();
      }));


      it("should use defaultTimeout of not configured via attribute", inject(function ($browser, leap) {
        spyOn($browser, "defer");
        spyOn(leap, "onGesture");
        var scope = $rootScope.$new();
        var html = "<div leap-swipe-" + direction + "='testFunction()'></div>";
        var element = $compile(html)(scope);

        defaultEvent.position = testEventsFor[direction];
        leap.onGesture.calls[0].args[1](defaultEvent);

        expect($browser.defer.calls[0].args[1]).toBe(leap.config().defaultTimeout);
      }));

      it("should use timeout if it configured", inject(function ($browser) {
        spyOn($browser, "defer");
        spyOn(leap, "onGesture");
        var scope = $rootScope.$new();
        var html = "<div leap-swipe-" + direction + "='testFunction()' leap-timeout='1000'></div>";
        var element = $compile(html)(scope);

        defaultEvent.position = testEventsFor[direction];
        leap.onGesture.calls[0].args[1](defaultEvent);

        expect($browser.defer.calls[0].args[1]).toBe('1000');
      }));

    });
  });


});
