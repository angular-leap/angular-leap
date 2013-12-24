describe("A Circle gesture directive", function () {

  beforeEach(module("angularLeap"));


  var eventTypes = ["circle", "circle-clockwise", "circle-counter-clockwise"],
    defaultEvent = {type: 'circle'},
    testEventsFor = {
      circle: [0, 0, -1],
      'circle-clockwise': [0, 0, -1],
      'circle-counter-clockwise': [0, 0, 1]
    };


  var _Leap;
  var _LeapController;

  beforeEach(inject(function ($window) {
    _LeapController = function () {
    };
    _LeapController.prototype.connect = function () {
    };
    _LeapController.prototype.on = function () {
    };


    _Leap = function () {
    };
    _Leap.Controller = _LeapController;

    $window.Leap = _Leap;
  }));


  angular.forEach(eventTypes, function (type) {
    describe(type, function () {


      it("should be executed and register " + type + " gesture event listener ", inject(function ($rootScope, $compile) {
        spyOn(_LeapController.prototype, "connect");
        spyOn(_LeapController.prototype, "on");

        var html = "<div leap-" + type + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);

        expect(_LeapController.prototype.connect).toHaveBeenCalled();
        expect(_LeapController.prototype.on).toHaveBeenCalled();
        expect(_LeapController.prototype.on.calls[0].args[0]).toEqual("gesture");
      }));


      it("should be executed and register gesture event listener", inject(function ($rootScope, $compile) {
        spyOn(_LeapController.prototype, "on");
        var html = "<div leap-" + type + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);
        spyOn(scope, "$apply");

        // Simulate Swipe Event, execute function
        defaultEvent.normal = testEventsFor[type];
        _LeapController.prototype.on.calls[0].args[1](defaultEvent);
        expect(scope.$apply).toHaveBeenCalled();
      }));

      it("should use the timeout function to prevent unwanted double event triggers", inject(function ($rootScope, $compile, $timeout) {
        spyOn(_LeapController.prototype, "on");


        var html = "<div leap-" + type + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);


        spyOn(scope, "$apply");
        // Simulate Swipe Event, execute function
        defaultEvent.normal = testEventsFor[type];
        _LeapController.prototype.on.calls[0].args[1](defaultEvent);
        _LeapController.prototype.on.calls[0].args[1](defaultEvent);

        expect(scope.$apply.calls.length).toBe(1);


        $timeout.flush();

        _LeapController.prototype.on.calls[0].args[1](defaultEvent);

        expect(scope.$apply.calls.length).toBe(2);
      }));


      it("should execute expressions", inject(function ($rootScope, $compile) {
        spyOn(_LeapController.prototype, "on");

        var html = "<div leap-" + type + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);

        scope.test = 1;

        defaultEvent.normal = testEventsFor[type];
        _LeapController.prototype.on.calls[0].args[1](defaultEvent);

        expect(scope.test).toBe(2);
      }));

      it("should execute scope function", inject(function ($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.testFunction = function () {
        };
        spyOn(scope, "testFunction");
        spyOn(_LeapController.prototype, "on");

        var html = "<div leap-" + type + "='testFunction()'></div>";
        $compile(html)(scope);

        defaultEvent.normal = testEventsFor[type];
        _LeapController.prototype.on.calls[0].args[1](defaultEvent);

        expect(scope.testFunction).toHaveBeenCalled();
      }));


      it("should use defaultTimeout of not configured via attribute", inject(function ($rootScope, $compile, $browser, leap) {
        spyOn($browser, "defer");
        spyOn(_LeapController.prototype, "on");
        var scope = $rootScope.$new();
        var html = "<div leap-" + type + "='testFunction()'></div>";
        $compile(html)(scope);

        defaultEvent.normal = testEventsFor[type];
        _LeapController.prototype.on.calls[0].args[1](defaultEvent);

        expect($browser.defer.calls[0].args[1]).toBe(leap.config().defaultTimeout);
      }));

      it("should use timeout if it configured", inject(function ($rootScope, $compile, $browser) {
        spyOn($browser, "defer");
        spyOn(_LeapController.prototype, "on");
        var scope = $rootScope.$new();
        var html = "<div leap-" + type + "='testFunction()' leap-timeout='1000'></div>";
        $compile(html)(scope);

        defaultEvent.normal = testEventsFor[type];
        _LeapController.prototype.on.calls[0].args[1](defaultEvent);


        expect($browser.defer.calls[0].args[1]).toBe('1000');
      }));

    });
  });


});
