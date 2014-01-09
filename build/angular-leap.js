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
'use strict';
angular.module('angularLeap').directive('leapOverlay', [
  '$document',
  '$window',
  'leap',
  function ($document, $window, leap) {
    var getElementBehindPoint = function (behind, x, y) {
      var originalDisplay = behind.css('display');
      behind.css('display', 'none');
      var element = angular.element($document[0].elementFromPoint(x, y));
      behind.css('display', originalDisplay);
      return element;
    };
    var listener = function (frame, container) {
      var width = container.clientWidth, height = container.clientHeight;
      var pointablesMap = frame.pointablesMap;
      for (var i in pointablesMap) {
        var pointable = pointablesMap[i];
        var pos = pointable.tipPosition;
        var size = Math.min(600 / Math.abs(pos[2]), 20);
        var x = pos[0], y = pos[1];
        console.log(pointable.id, x, y);
        var element = document.getElementById('pointable' + pointable.id);
        if (!element) {
          element = angular.element('<div class="box" id="pointable' + pointable.id + '"> </div>');
          container.append(element);
        }
        element.css({});
      }
    };
    return {
      restrict: 'A',
      link: function (scope, element) {
        scope.width = element.clientWidth;
        scope.height = element.clientHeight;
        var currentSelection;
        leap.controller().on('frame', function (frame) {
          if (!scope.frame) {
            scope.frame = frame;
          }
          scope.$apply(function () {
            scope.pointables = [];
            angular.forEach(frame.pointables, function (pointable) {
              var size = Math.abs(pointable.tipPosition[2] + frame.interactionBox.depth);
              var centerx = pointable.tipPosition[0] - frame.interactionBox.center[0];
              var centery = pointable.tipPosition[1] - frame.interactionBox.center[1];
              var map = {
                  id: pointable.id,
                  _position: pointable.tipPosition,
                  position: {
                    x: Math.abs((frame.interactionBox.width + centerx) / (frame.interactionBox.width * 2) * element[0].clientWidth) - size / 2,
                    y: Math.abs((frame.interactionBox.height - centery) / (frame.interactionBox.height * 2) * element[0].clientHeight) - size / 2,
                    size: size
                  },
                  tool: pointable.tool
                };
              scope.pointables.push(map);
            }, element);
          });
        });
      },
      templateUrl: 'src/view/overlay.html'
    };
  }
]);