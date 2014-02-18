'use strict';
angular.module('angularLeap', []);
'use strict';
angular.module('angularLeap').provider('leapConfig', function () {
  var _configFn, config = {
      defaultTimeout: 650,
      gestureIntense: 0.5
    };
  _configFn = function (map) {
    return angular.extend(config, map);
  };
  this.config = function (map) {
    return _configFn(map);
  };
  this.$get = function () {
    return _configFn;
  };
});
'use strict';
angular.module('angularLeap').provider('leap', [
  'leapConfigProvider',
  function (leapConfigProvider) {
    var controller, _controllerFn;
    _controllerFn = function ($window) {
      if (!controller) {
        controller = new $window.Leap.Controller({ enableGestures: true });
        controller.connect();
      }
      return controller;
    };
    this.config = leapConfigProvider;
    this.$get = [
      '$window',
      'leapConfig',
      'leapFn',
      function ($window, leapConfig, leapFn) {
        if (!$window.Leap) {
          throw new Error('You should include LeapJS Native JavaScript API');
        }
        return {
          controller: function () {
            return _controllerFn($window);
          },
          fn: leapFn,
          config: leapConfig
        };
      }
    ];
  }
]);
'use strict';
angular.module('angularLeap').factory('leapFn', [
  '$timeout',
  'leapConfig',
  function ($timeout, leapConfig) {
    var _timeoutFn, _swipeMovement, _circleMovement, timeoutActive = false;
    _swipeMovement = function (gesture) {
      var xdiff = gesture.startPosition[0] - gesture.position[0], ydiff = gesture.startPosition[1] - gesture.position[1], zdiff = gesture.startPosition[2] - gesture.position[2];
      var movement = {
          x: {
            distance: Math.abs(xdiff),
            type: xdiff > 0 ? 'left' : 'right',
            direction: xdiff
          },
          y: {
            distance: Math.abs(ydiff),
            type: ydiff > 0 ? 'down' : 'up',
            direction: ydiff
          },
          z: {
            distance: Math.abs(zdiff),
            type: zdiff > 0 ? 'forward' : 'backward',
            direction: zdiff
          }
        };
      movement.isSwipe = {
        left: xdiff > 0 && movement.x.distance > leapConfig().gestureIntense,
        right: xdiff < 0 && movement.x.distance > leapConfig().gestureIntense,
        up: ydiff < 0 && movement.y.distance > leapConfig().gestureIntense,
        down: ydiff > 0 && movement.y.distance > leapConfig().gestureIntense,
        forward: zdiff < 0 && movement.z.distance > leapConfig().gestureIntense,
        backward: zdiff > 0 && movement.z.distance > leapConfig().gestureIntense
      };
      return movement;
    };
    _circleMovement = function (gesture) {
      var movement = {
          count: Math.round(gesture.progress, 10),
          type: gesture.normal[2] > 0 ? 'counterClockwise' : 'clockwise'
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
    return {
      timeout: function (ms) {
        return _timeoutFn(ms);
      },
      swipeMovement: function (gesture) {
        return _swipeMovement(gesture);
      },
      circleMovement: function (gesture) {
        return _circleMovement(gesture);
      }
    };
  }
]);
'use strict';
angular.forEach([
  'leapKeyTap',
  'leapScreenTap',
  'leapCircle',
  'leapCircleClockwise',
  'leapCircleCounterClockwise',
  'leapSwipeLeft',
  'leapSwipeRight',
  'leapSwipeUp',
  'leapSwipeDown',
  'leapSwipeForward',
  'leapSwipeBackward'
], function (directiveName) {
  var splitByCamelCase = directiveName.replace(/([A-Z])/g, ' $1').split(' '), eventType = splitByCamelCase[1].toLowerCase(), direction = splitByCamelCase[2];
  if (splitByCamelCase[2] === 'Tap') {
    eventType += splitByCamelCase[2];
  } else if (splitByCamelCase[2] === 'Circle') {
    eventType += splitByCamelCase[2];
    if (splitByCamelCase[3]) {
      eventType += splitByCamelCase[3];
    }
  }
  angular.module('angularLeap').directive(directiveName, [
    '$parse',
    'leap',
    function ($parse, leap) {
      return function (scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        var timeout = attr.leapTimeout ? attr.leapTimeout : leap.config().defaultTimeout;
        var listener = function (gesture) {
          if (gesture.type === eventType) {
            if (eventType === 'swipe' && !leap.fn.swipeMovement(gesture).isSwipe[direction.toLowerCase()]) {
              return;
            }
            if (splitByCamelCase[2] === 'Circle' && direction && leap.fn.circleMovement(gesture).type !== direction.toLowerCase()) {
              return;
            }
            if (!leap.fn.timeout(timeout)) {
              scope.$apply(function () {
                fn(scope, { $gesture: gesture });
              });
            }
          }
        };
        leap.controller().on('gesture', listener);
        scope.$on('$destroy', function () {
          leap.controller().removeListener('gesture', listener);
        });
      };
    }
  ]);
});