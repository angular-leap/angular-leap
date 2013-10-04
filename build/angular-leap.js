'use strict';
angular.module('angular-leap', []);
angular.module('angular-leap').value('leapConfig', {
  defaultTimeout: 650,
  defaultGestureIntense: 0.5
});
'use strict';
angular.module('angular-leap').service('leap', [
  '$window',
  function ($window) {
    if (!$window.Leap) {
      throw new Error('You should include LeapJS Native JavaScript API');
    }
    var controller, getController = function () {
        if (!controller) {
          controller = new $window.Leap.Controller({ enableGestures: true });
          controller.connect();
        }
        return controller;
      };
    return { controller: getController };
  }
]);
'use strict';
angular.forEach([
  'leapKeyTap',
  'leapScreenTap',
  'leapCircle',
  'leapSwipeLeft',
  'leapSwipeRight',
  'leapSwipeUp',
  'leapSwipeDown'
], function (directiveName) {
  var splitByCamelCase = directiveName.replace(/([A-Z])/g, ' $1').split(' '), eventType = splitByCamelCase[1].toLowerCase(), direction = splitByCamelCase[2];
  if (splitByCamelCase[2] === 'Tap') {
    eventType += splitByCamelCase[2];
  }
  angular.module('angular-leap').directive(directiveName, [
    '$parse',
    'leap',
    'leapHelperService',
    'leapConfig',
    function ($parse, leap, leapHelperService, leapConfig) {
      return function (scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        var timeout = attr.leapTimeout ? attr.leapTimeout : leapConfig.defaultTimeout;
        leap.controller().on('gesture', function (gesture) {
          if (gesture.type === eventType) {
            if (eventType === 'swipe' && !leapHelperService.testForDirection(gesture, direction)) {
              return;
            }
            if (!leapHelperService.timeout(timeout)) {
              scope.$apply(function () {
                fn(scope, { $gesture: gesture });
              });
            }
          }
        });
      };
    }
  ]);
});
'use strict';
angular.module('angular-leap').factory('leapHelperService', [
  '$timeout',
  'leapConfig',
  function ($timeout, leapConfig) {
    var timeoutActive = false, testForDirection = function (gestureEvent, direction) {
        var directionHorizontal = gestureEvent.direction[0], directionVertical = gestureEvent.direction[1], limit = leapConfig.defaultGestureIntense, directionDefinition = {
            Left: directionHorizontal > limit,
            Right: -directionHorizontal > limit,
            Up: directionVertical > limit,
            Down: -directionVertical > limit
          };
        return directionDefinition[direction];
      }, timeoutHandler = function (ms) {
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
      testForDirection: testForDirection,
      timeout: timeoutHandler
    };
  }
]);