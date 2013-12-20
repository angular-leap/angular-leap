describe('A leapFnService', function () {


  /* Test basic configurations */
  var testBasicConfiguration = {
      timeout: 650,
      gestureIntense: 0.5
    },
    leapFn;
  var directions = ['left', 'right', 'up', 'down', 'forward', 'backward'],
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

  beforeEach(module('angularLeap'));
  beforeEach(inject(function (_leapFn_) {
    leapFn = _leapFn_;
  }));

  it('should offer a timeout function', function () {
    expect(leapFn.timeout).toBeDefined();
  });

  describe('timeout function', function () {

    it('should return false if no timeout is active', function () {
      expect(leapFn.timeout()).toBe(false);
    });

    // TODO: Function not so clear, rename/refactor
    it('should return current active state on call', inject(function ($timeout) {
      expect(leapFn.timeout()).toBe(false);
      expect(leapFn.timeout(100)).toBe(false);
      expect(leapFn.timeout(100)).toBe(true);
      expect(leapFn.timeout()).toBe(true);
      $timeout.flush();
      expect(leapFn.timeout()).toBe(false);
      expect(leapFn.timeout(100)).toBe(false);
      expect(leapFn.timeout(100)).toBe(true);
      expect(leapFn.timeout()).toBe(true);
    }));

    it('should create an timeout with configured time', inject(function ($browser) {
      spyOn($browser, 'defer');
      var testTime = 1234;
      leapFn.timeout(testTime);
      expect($browser.defer.calls[0].args[1]).toBe(testTime);
    }));

  });


  describe('gestureMovement function', function () {

    it('should be defined', function () {
      expect(leapFn.gestureMovement).toBeDefined();
    });

    describe('swipe property', function () {
      for (i in directions) {
        currentTestDirection = directions[i];
        expect(currentTestDirection).toBeDefined();
        for (var event in testEventsFor) {
          it('should true if ' + currentTestDirection + '===' + event, function () {
              // Test current = true, else false
              defaultEvent.position = testEventsFor[event];
              expect(leapFn.gestureMovement(defaultEvent).isSwipe[currentTestDirection.toLowerCase()]).toBe(currentTestDirection === event);
            }
          );
        }
      }
    });

    it('should use a minimum limit for detection', function () {

      defaultEvent.position = [0.1, 0, 0];
      expect(leapFn.gestureMovement(defaultEvent).isSwipe['left']).toBe(false);
      defaultEvent.position = [-1, 0, 0];
      expect(leapFn.gestureMovement(defaultEvent).isSwipe['left']).toBe(true);

    });
  });
});




