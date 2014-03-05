describe("A Circle gesture directive", function () {

  beforeEach(module("angularLeap"));


  var eventTypes = ["Circle", "CircleClockwise", "CircleCounterClockwise"],
    defaultEvent = {type: 'circle'},
    testEventsFor = {
      circle: [0, 0, -1],
      'circleClockwise': [0, 0, -1],
      'circleCounterClockwise': [0, 0, 1]
    };


  var _Leap,
    _LeapController,
    leap;

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

  beforeEach(inject(function (_leap_) {
    leap = _leap_;
  }));


  angular.forEach(eventTypes, function (eventType) {

    var splitByCamelCase = eventType.replace(/([A-Z])/g, ' $1').split(' '),
      directiveName = splitByCamelCase[1].toLowerCase();

    if (splitByCamelCase[2]) {
      directiveName += '-' + splitByCamelCase[2];
    }

    if (splitByCamelCase[3]) {
      directiveName += '-' + splitByCamelCase[3];
    }

    console.log(eventType,directiveName);

    describe(eventType, function () {


      it("should be executed and register " + eventType + " gesture event listener ", inject(function ($rootScope, $compile) {
        spyOn(leap, "onGesture");

        var html = "<div leap-" + directiveName + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);

        expect(leap.onGesture).toHaveBeenCalled();
        expect(leap.onGesture.calls[0].args[0]).toEqual("leap" + eventType);
      }));


      it("should be executed and register gesture event listener", inject(function ($rootScope, $compile) {
        spyOn(leap, "onGesture");

        var html = "<div leap-" + directiveName + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);
        spyOn(scope, "$apply");

        // Simulate Swipe Event, execute function
        defaultEvent.normal = testEventsFor[eventType];
        leap.onGesture.calls[0].args[1](defaultEvent);
        expect(scope.$apply).toHaveBeenCalled();
      }));

      it("should use the timeout function to prevent unwanted double event triggers", inject(function ($rootScope, $compile, $timeout) {
        spyOn(leap, "onGesture");


        var html = "<div leap-" + directiveName + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);


        spyOn(scope, "$apply");
        // Simulate Swipe Event, execute function
        defaultEvent.normal = testEventsFor[eventType];
        leap.onGesture.calls[0].args[1](defaultEvent);
        leap.onGesture.calls[0].args[1](defaultEvent);

        expect(scope.$apply.calls.length).toBe(1);


        $timeout.flush();

        leap.onGesture.calls[0].args[1](defaultEvent);

        expect(scope.$apply.calls.length).toBe(2);
      }));


      it("should execute expressions", inject(function ($rootScope, $compile) {
        spyOn(leap, "onGesture");

        var html = "<div leap-" + directiveName + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        $compile(html)(scope);

        scope.test = 1;

        defaultEvent.normal = testEventsFor[eventType];
        leap.onGesture.calls[0].args[1](defaultEvent);

        expect(scope.test).toBe(2);
      }));

      it("should execute scope function", inject(function ($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.testFunction = function () {
        };
        spyOn(scope, "testFunction");
        spyOn(leap, "onGesture");

        var html = "<div leap-" + directiveName + "='testFunction()'></div>";
        $compile(html)(scope);

        defaultEvent.normal = testEventsFor[eventType];
        leap.onGesture.calls[0].args[1](defaultEvent);

        expect(scope.testFunction).toHaveBeenCalled();
      }));


      it("should use defaultTimeout of not configured via attribute", inject(function ($rootScope, $compile, $browser, leap) {
        spyOn($browser, "defer");
        spyOn(leap, "onGesture");
        var scope = $rootScope.$new();
        var html = "<div leap-" + directiveName + "='testFunction()'></div>";
        $compile(html)(scope);

        defaultEvent.normal = testEventsFor[eventType];
        leap.onGesture.calls[0].args[1](defaultEvent);

        expect($browser.defer.calls[0].args[1]).toBe(leap.config().defaultTimeout);
      }));

      it("should use timeout if it configured", inject(function ($rootScope, $compile, $browser) {
        spyOn($browser, "defer");
        spyOn(leap, "onGesture");
        var scope = $rootScope.$new();
        var html = "<div leap-" + directiveName + "='testFunction()' leap-timeout='1000'></div>";
        $compile(html)(scope);

        defaultEvent.normal = testEventsFor[eventType];
        leap.onGesture.calls[0].args[1](defaultEvent);


        expect($browser.defer.calls[0].args[1]).toBe('1000');
      }));

    });
  });


});
