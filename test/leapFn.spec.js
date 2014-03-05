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
    swipeEvent = {startPosition: [0, 0, 0], type: 'swipe'},
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


  describe('Public API', function () {
    it('should offer a timeout function', function () {
      expect(leapFn.timeout).toBeDefined();
    });

    it('should offer a swipeMovement function', function () {
      expect(leapFn.movement).toBeDefined();
    });

    it('should offer a circleMovement function', function () {
      expect(leapFn.circleMovement).toBeDefined();
    });

    it('should offer a swipeMovement function', function () {
      expect(leapFn.swipeMovement).toBeDefined();
    });
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

  describe('movement function', function () {

    it('should return an structured object', function () {
      swipeEvent.position = [1, 2, 3];
      var object = leapFn.movement(swipeEvent);

      expect(object.x).toBeDefined();
      expect(object.x.type).toBeDefined();
      expect(object.x.distance).toBeDefined();
      expect(object.x.direction).toBeDefined();

      expect(object.y).toBeDefined();
      expect(object.y.type).toBeDefined();
      expect(object.y.distance).toBeDefined();
      expect(object.y.direction).toBeDefined();

      expect(object.z).toBeDefined();
      expect(object.z.type).toBeDefined();
      expect(object.z.distance).toBeDefined();
      expect(object.z.direction).toBeDefined();

    });

    it('should return the direction', function () {
      swipeEvent.position = [1, 2, 3];
      var object = leapFn.movement(swipeEvent);

      expect(object.x.direction).toBe(swipeEvent.position[0]);
      expect(object.y.direction).toBe(swipeEvent.position[1]);
      expect(object.z.direction).toBe(swipeEvent.position[2]);

    });

    it('should return the distance as absolute number of the direction', function () {
      spyOn(Math, 'abs');
      swipeEvent.position = [1, 2, 3];
      leapFn.movement(swipeEvent);
      expect(Math.abs.calls.length).toBe(3);

    });

    it('should detect right direction', function () {
      swipeEvent.position = [1, 0, 0];
      var object = leapFn.movement(swipeEvent);
      expect(object.x.type).toBe('right');
    });

    it('should detect left direction', function () {
      swipeEvent.position = [-1, 0, 0];
      var object = leapFn.movement(swipeEvent);
      expect(object.x.type).toBe('left');
    });

    it('should detect up direction', function () {
      swipeEvent.position = [0, 1, 0];
      var object = leapFn.movement(swipeEvent);
      expect(object.y.type).toBe('up');
    });

    it('should detect down direction', function () {
      swipeEvent.position = [0, -1, 0];
      var object = leapFn.movement(swipeEvent);
      expect(object.y.type).toBe('down');
    });

    it('should detect backward direction', function () {
      swipeEvent.position = [0, 0, -1];
      var object = leapFn.movement(swipeEvent);
      expect(object.z.type).toBe('backward');
    });

    it('should detect forward direction', function () {
      swipeEvent.position = [0 , 0, 1];
      var object = leapFn.movement(swipeEvent);
      expect(object.z.type).toBe('forward');
    });


    for (i in directions) {
      currentTestDirection = directions[i];
      expect(currentTestDirection).toBeDefined();
      for (var event in testEventsFor) {
        it('should return correct isSwipe hashmap' + currentTestDirection + '===' + event, function () {
            // Test current = true, else false
            swipeEvent.position = testEventsFor[event];
            expect(leapFn.movement(swipeEvent).isSwipe[currentTestDirection.toLowerCase()]).toBe(currentTestDirection === event);
          }
        );
      }
    }

    it('should use a minimum limit for detection', function () {

      swipeEvent.position = [-0.1, 0, 0];
      expect(leapFn.movement(swipeEvent).isSwipe['left']).toBe(false);
      swipeEvent.position = [-1, 0, 0];
      expect(leapFn.movement(swipeEvent).isSwipe['left']).toBe(true);

    });
  });



  describe('swipeMovement function', function () {

    it('should return an structured object', function () {
      swipeEvent.position = [1, 2, 3];
      var object = leapFn.swipeMovement(swipeEvent);

      expect(object.direction).toBeDefined();
      expect(object.distance).toBeDefined();
      expect(object.type).toBeDefined();

      expect(object.movement.x).toBeDefined();
      expect(object.movement.x.type).toBeDefined();
      expect(object.movement.x.distance).toBeDefined();
      expect(object.movement.x.direction).toBeDefined();

      expect(object.movement.y).toBeDefined();
      expect(object.movement.y.type).toBeDefined();
      expect(object.movement.y.distance).toBeDefined();
      expect(object.movement.y.direction).toBeDefined();

      expect(object.movement.z).toBeDefined();
      expect(object.movement.z.type).toBeDefined();
      expect(object.movement.z.distance).toBeDefined();
      expect(object.movement.z.direction).toBeDefined();

    });

    it('should use a minimum limit for detection', function () {

      swipeEvent.position = [-0.1, 0, 0];
      expect(leapFn.swipeMovement(swipeEvent)).toBeUndefined();
      swipeEvent.position = [-1, 0, 0];
      expect(leapFn.swipeMovement(swipeEvent)).toBeDefined();

    });

    it('should only return the direction with biggest movement', function () {

      swipeEvent.position = [10, 10, 100];
      expect(leapFn.swipeMovement(swipeEvent).type).toBe('forward');
      swipeEvent.position = [10, 100, 10];
      expect(leapFn.swipeMovement(swipeEvent).type).toBe('up');

    });
  });


  describe('circleMovement', function () {

    var circleEvent = {
      type: 'circle'
    };

    it('should detect clockwise circle-events', function () {
      circleEvent.normal = [0, 0, -1];
      expect(leapFn.circleMovement(circleEvent).type).toBe('clockwise');
    });

    it('should detect counter-clockwise circle-events', function () {
      circleEvent.normal = [0, 0, 1];
      expect(leapFn.circleMovement(circleEvent).type).toBe('counterClockwise');
    });


    it('should detect the count of circle-events', function () {
      circleEvent.normal = [0, 0, 1];
      circleEvent.progress = 10;
      expect(leapFn.circleMovement(circleEvent).count).toBe(circleEvent.progress);
    });


    it('should detect the rounded count of circle-events', function () {
      circleEvent.normal = [0, 0, 1];
      circleEvent.progress = 10.1234;
      expect(leapFn.circleMovement(circleEvent).count).not.toBe(circleEvent.progress);
      expect(leapFn.circleMovement(circleEvent).count).toBe(Math.round(circleEvent.progress, 10));
    });

    it('should detect the rounded count of circle-events with a base of 10', function () {
      spyOn(Math, 'round');
      circleEvent.normal = [0, 0, 1];
      circleEvent.progress = 10.1234;
      // execute
      leapFn.circleMovement(circleEvent);
      expect(Math.round).toHaveBeenCalled();
      expect(Math.round.calls[0].args[1]).toBe(10);
    });

  });

});




