'use strict';

angular.module('angularLeap')
  .factory('leapFn', function ($timeout, leapConfig) {
    var _timeoutFn,
      _gestureMovement,
      swipeMovement,
      circleMovement,
      timeoutActive = false;

    swipeMovement = function (gesture) {
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
        left: (xdiff > 0) && movement.x.distance > leapConfig().gestureIntense,
        right: (xdiff < 0) && movement.x.distance > leapConfig().gestureIntense,
        up: (ydiff < 0) && movement.y.distance > leapConfig().gestureIntense,
        down: (ydiff > 0) && movement.y.distance > leapConfig().gestureIntense,
        forward: (zdiff < 0) && movement.z.distance > leapConfig().gestureIntense,
        backward: (zdiff > 0) && movement.z.distance > leapConfig().gestureIntense
      };

      return movement;
    };

    circleMovement = function (gesture) {
      var movement = {
        count: Math.round(gesture.progress),
        type: (gesture.normal[2] > 0) ? 'counterClockwise' : 'clockwise'
      };
      return movement;
    };


    _timeoutFn = function (ms) {
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
      var movement;
      if (gesture.type === 'swipe') {
        movement = swipeMovement(gesture);
      }
      if (gesture.type === 'circle') {
        movement = circleMovement(gesture);
      }
      return movement;
    };

    // Service API
    return {
      // This wrapper functions just for API readability ( else you can't see the params without searching)
      timeout: function (ms) {
        return _timeoutFn(ms);
      },
      gestureMovement: function (gesture) {
        return _gestureMovement(gesture);
      }
    };
  });
