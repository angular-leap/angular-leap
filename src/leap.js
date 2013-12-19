'use strict';

angular.module('angularLeap')
  .provider('leap', function () {

    var controller,
      _timeoutFn,
      _gestureMovement,
      _defaultTimeoutFn,
      _gestureIntenseFn,
      _controllerFn,
      defaultTimeout = 650,
      gestureIntense = 0.5,
      timeoutActive = false;

    /*
     Config
     */
    _defaultTimeoutFn = function (timeout) {
      if (timeout) {
        defaultTimeout = timeout;
      }
      return defaultTimeout;
    };


    _gestureIntenseFn = function (gestureIntenseArgument) {
      if (gestureIntenseArgument) {
        gestureIntense = gestureIntenseArgument;
      }
      return gestureIntense;
    };

    /*
     Functions
     */

    _timeoutFn = function (ms, $timeout) {
      var beforeState = timeoutActive;
      if (!timeoutActive && ms) {
        timeoutActive = true;
        $timeout(function () {
          timeoutActive = false;
        }, ms);
      }
      return beforeState;
    };


    _gestureMovement = function (gesture) {
      var xdiff = gesture.startPosition[0] - gesture.position[0],
        ydiff = gesture.startPosition[1] - gesture.position[1],
        zdiff = gesture.startPosition[2] - gesture.position[2];

      var movement = {
        x: {
          distance: Math.abs(xdiff),
          type: (xdiff > 0) ? 'left' : 'right',
          direction: xdiff
        },
        y: {
          distance: Math.abs(ydiff),
          type: (ydiff > 0) ? 'down' : 'up',
          direction: ydiff
        },
        z: {
          distance: Math.abs(zdiff),
          type: (zdiff > 0) ? 'forward' : 'backward',
          direction: zdiff
        }
      };

      movement.isSwipe = {
        left: (xdiff > 0) && movement.x.distance > gestureIntense,
        right: (xdiff < 0) && movement.x.distance > gestureIntense,
        up: (ydiff < 0) && movement.y.distance > gestureIntense,
        down: (ydiff > 0) && movement.y.distance > gestureIntense,
        forward: (zdiff < 0) && movement.z.distance > gestureIntense,
        backward: (zdiff > 0) && movement.z.distance > gestureIntense
      };

      return movement;
    };

    /*
     Core
     */
    _controllerFn = function ($window) {
      if (!controller) {
        controller = new $window.Leap.Controller({enableGestures: true});
        controller.connect();
      }
      return controller;
    };

    // Provider API
    this.defaultTimeout = function (timeout) {
      return _defaultTimeoutFn(timeout);
    };
    this.gestureIntense = function (gestureIntense) {
      return _gestureIntenseFn(gestureIntense);
    };

    this.$get = function ($window, $timeout) {
      if (!$window.Leap) {
        throw new Error('You should include LeapJS Native JavaScript API');
      }
      // Service API
      return {
        controller: function () {
          return _controllerFn($window);
        },
        timeout: function (ms) {
          return _timeoutFn(ms, $timeout);
        },
        gestureMovement: function (gesture) {
          return _gestureMovement(gesture);
        },
        defaultTimeout: function (timeout) {
          return _defaultTimeoutFn(timeout);
        },
        gestureIntense: function (gestureIntense) {
          return _gestureIntenseFn(gestureIntense);
        }
      };
    };


  });
