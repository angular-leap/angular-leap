'use strict';
angular.module('angularLeap', []);
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
        var listeners;
        var listener = function (gesture) {
          var movement, listenerKey = 'leap' + gesture.type;
          if (gesture.type === 'circle') {
            movement = leapFn.circleMovement(gesture);
            listenerKey += movement.type ? movement.type : '';
          } else if (gesture.type === 'swipe') {
            movement = leapFn.swipeMovement(gesture);
            listenerKey += movement.type ? movement.type : '';
          } else if (gesture.type === 'screenTap') {
            movement = gesture;
          } else if (gesture.type === 'keyTap') {
            movement = gesture;
          }
          if (movement) {
            angular.forEach(listeners[listenerKey.toLocaleLowerCase()], function (listenerFn) {
              listenerFn(gesture, movement);
            });
          }
        };
        var _onGesture = function (eventName, fn) {
          eventName = eventName.toLowerCase();
          if (!listeners) {
            listeners = {};
            _controllerFn($window).on('gesture', listener);
          }
          if (listeners[eventName] instanceof Array) {
            listeners[eventName].push(fn);
          } else {
            listeners[eventName] = [fn];
          }
        };
        return {
          controller: function () {
            return _controllerFn($window);
          },
          getLastFrame: function () {
            return _controllerFn($window).frame();
          },
          fn: leapFn,
          config: leapConfig,
          onGesture: _onGesture,
          _listeners: listeners
        };
      }
    ];
  }
]);
;
angular.module('angularLeap').factory('leapFn', [
  '$timeout',
  'leapConfig',
  function ($timeout, leapConfig) {
    var _timeoutFn, _movement, _circleMovement, _swipeMovement, timeoutActive = false;
    _movement = function (gesture) {
      var xdiff = gesture.startPosition[0] - gesture.position[0], ydiff = gesture.startPosition[1] - gesture.position[1], zdiff = gesture.startPosition[2] - gesture.position[2];
      var movement = {
          x: {
            distance: Math.abs(xdiff),
            type: xdiff > 0 ? 'left' : 'right',
            direction: -xdiff
          },
          y: {
            distance: Math.abs(ydiff),
            type: ydiff > 0 ? 'down' : 'up',
            direction: -ydiff
          },
          z: {
            distance: Math.abs(zdiff),
            type: zdiff < 0 ? 'forward' : 'backward',
            direction: -zdiff
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
    _swipeMovement = function (gesture) {
      var swipeMovement, movement = _movement(gesture);
      angular.forEach(movement, function (data) {
        if (data.distance) {
          if (!swipeMovement) {
            swipeMovement = data;
          } else {
            swipeMovement = swipeMovement.distance > data.distance ? swipeMovement : data;
          }
        }
      });
      swipeMovement.movement = movement;
      if (!movement.isSwipe[swipeMovement.type]) {
        swipeMovement = undefined;
      }
      return swipeMovement;
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
      movement: function (gesture) {
        return _movement(gesture);
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
angular.module('angularLeap').directive('leapBind', [
  '$interval',
  'leap',
  function ($interval, leap) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var updateRate = 50;
        if (angular.isDefined(attr.leapBindUpdateRate)) {
          updateRate = attr.leapBindUpdateRate;
        }
        function getObjValueByArrayPath(object, pathArray) {
          var nextStep = pathArray.shift();
          if (!angular.isObject(object)) {
            return object;
          }
          if (!pathArray.length) {
            return object[nextStep];
          }
          return getObjValueByArrayPath(object[nextStep], pathArray);
        }
        function getPathArrayFromString(pathAsString) {
          var pathAsArray = [];
          function removeEmptyFilter(element) {
            return element.length > 0;
          }
          pathAsString.split(/(\w*)\.?\[([\w\d]*)\]/).filter(removeEmptyFilter).map(function (e) {
            return e.split('.').filter(removeEmptyFilter);
          }).forEach(function (element) {
            while (element.length) {
              pathAsArray.push(element.shift());
            }
          });
          return pathAsArray;
        }
        function update() {
          var configObj = scope.$eval(attr.leapBind);
          if (angular.isObject(configObj)) {
            angular.forEach(configObj, function (v, k) {
              scope[k] = getObjValueByArrayPath(leap.getLastFrame(), getPathArrayFromString(v));
            });
          }
        }
        update();
        $interval(update, updateRate);
      }
    };
  }
]);
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
  var splitByCamelCase = directiveName.replace(/([A-Z])/g, ' $1').split(' '), eventType = splitByCamelCase[1].toLowerCase();
  if (splitByCamelCase[2]) {
    eventType += splitByCamelCase[2];
  }
  if (splitByCamelCase[3]) {
    eventType += splitByCamelCase[3];
  }
  angular.module('angularLeap').directive(directiveName, [
    '$parse',
    'leap',
    function ($parse, leap) {
      return function (scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        var timeout = attr.leapTimeout ? attr.leapTimeout : leap.config().defaultTimeout;
        leap.onGesture(directiveName, function (gesture) {
          if (!leap.fn.timeout(timeout)) {
            scope.$apply(function () {
              fn(scope, { $gesture: gesture });
            });
          }
        });
      };
    }
  ]);
});