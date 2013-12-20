describe('A leapService', function () {

  /* Test basic configurations */
  var testBasicConfiguration = {
    timeout: 650,
    gestureIntense: 0.5
  };
  var directions = ["left", "right", "up", "down", "forward", "backward"],
    i,
    currentTestDirection,
    defaultEvent = {startPosition: [0, 0, 0], type: 'swipe'},
    testEventsFor = {
      left: [-1, 0, 0],
      right: [1, 0, 0],
      up: [0, 1, 0],
      down: [0, -1, 0],
      forward: [0, 0, 1],
      backward: [0, 0, -1]
    };

  describe('default instance', function () {
    beforeEach(module('angularLeap'));

    it('should throw an exception if global variant Leap is not defined', inject(function ($injector, $window) {

      var invokeLeapService = function () {
        $injector.invoke(function (leap) {
        });
      };

      $window.Leap = undefined;
      expect($window.Leap).not.toBeDefined();
      expect(invokeLeapService).toThrow(new Error('You should include LeapJS Native JavaScript API'));
    }));

    describe('that could use global Leap Variant', function () {


      var _Leap;
      var _LeapController;

      beforeEach(inject(function ($window) {
        _LeapController = function () {
        };
        _LeapController.prototype.connect = function () {
        };


        _Leap = function () {
        };
        _Leap.Controller = _LeapController;

        $window.Leap = _Leap;
      }));


      it('should offer a controller function', inject(function ($injector) {

        var leapController;
        $injector.invoke(function (leap) {
          leapController = leap;
        });

        expect(leapController.controller).toBeDefined();
      }));


      it('should call LeapController.connect on call of controller', inject(function ($injector) {
        var leapController;
        spyOn(_LeapController.prototype, 'connect');

        $injector.invoke(function (leap) {
          leapController = leap;
        });

        leapController.controller();

        expect(_LeapController.prototype.connect).toHaveBeenCalled();
      }));


      it('should call LeapController.connect only once', inject(function ($injector) {
        var leapController;
        spyOn(_LeapController.prototype, 'connect');

        $injector.invoke(function (leap) {
          leapController = leap;
        });

        leapController.controller();
        leapController.controller();
        leapController.controller();

        expect(_LeapController.prototype.connect.calls.length).toBe(1);
      }));
    });


    it('should provide configuration service via config()', inject(function (leap, leapConfig) {
      expect(leap.config()).toBeDefined(leapConfig);
    }));

    it("should offer a timeout function", inject(function (leap) {
      expect(leap.timeout).toBeDefined();
    }));

    describe("timeout function", function () {

      it("should return false if no timeout is active", inject(function (leap) {
        expect(leap.timeout()).toBe(false);
      }));

      // TODO: Function not so clear, rename/refactor
      it("should return current active state on call", inject(function (leap, $timeout) {
        expect(leap.timeout()).toBe(false);
        expect(leap.timeout(100)).toBe(false);
        expect(leap.timeout(100)).toBe(true);
        expect(leap.timeout()).toBe(true);
        $timeout.flush();
        expect(leap.timeout()).toBe(false);
        expect(leap.timeout(100)).toBe(false);
        expect(leap.timeout(100)).toBe(true);
        expect(leap.timeout()).toBe(true);
      }));

      it("should create an timeout with configured time", inject(function ($browser, leap) {
        spyOn($browser, 'defer');
        var testTime = 1234;
        leap.timeout(testTime);
        expect($browser.defer.calls[0].args[1]).toBe(testTime);
      }))

    });


    describe("gestureMovement function", function () {

      it("should be defined", inject(function (leap) {
        expect(leap.gestureMovement).toBeDefined();
      }));

      describe("swipe property", function () {
        for (i in directions) {
          currentTestDirection = directions[i];
          expect(currentTestDirection).toBeDefined();
          for (var event in testEventsFor) {
            it("should true if " + currentTestDirection + "===" + event, inject(function (leap) {
                // Test current = true, else false
                defaultEvent.position = testEventsFor[event];
                expect(leap.gestureMovement(defaultEvent).isSwipe[currentTestDirection.toLowerCase()]).toBe(currentTestDirection === event);
              }
            ))
            ;
          }
        }
        ;
      });

      it("should use a minimum limit for detection", inject(function (leap) {

        defaultEvent.position = [0.1, 0, 0];
        expect(leap.gestureMovement(defaultEvent).isSwipe["left"]).toBe(false);
        defaultEvent.position = [-1, 0, 0];
        expect(leap.gestureMovement(defaultEvent).isSwipe["left"]).toBe(true);


      }));

    });


  });




});




