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
    var splitByCamelCase = directiveName.replace(/([A-Z])/g, ' $1').split(' '),
      eventType = splitByCamelCase[1].toLowerCase(),
      direction = splitByCamelCase[2];

    // e.g. ScreenTap + KeyTap
    if (splitByCamelCase[2] === 'Tap') {
      eventType += splitByCamelCase[2];
    }
    else if (splitByCamelCase[2] === 'Circle') {
      eventType += splitByCamelCase[2];
      if (splitByCamelCase[3]) {
        eventType += splitByCamelCase[3];
      }
    }

    angular.module('angularLeap').directive(directiveName, function ($parse, leap) {
      return function (scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        var timeout = (attr.leapTimeout) ? attr.leapTimeout : leap.config().defaultTimeout;

        var listener = function (gesture) {
          if (gesture.type === eventType) {
            if (eventType === 'swipe' && !leap.fn.swipeMovement(gesture).isSwipe[direction.toLowerCase()]) {
              return;
            }
            // 'counter-clockwise' : 'clockwise'
            if (splitByCamelCase[2] === 'Circle' && direction && leap.fn.circleMovement(gesture).type !== direction.toLowerCase()) {
              return;
            }
            if (!leap.fn.timeout(timeout)) {
              scope.$apply(function () {
                fn(scope, {$gesture: gesture});
              });
            }
          }
        };
        // Listener
        leap.controller().on('gesture', listener);
        scope.$on('$destroy', function () {
          leap.controller().removeListener('gesture', listener);
        });
      };
    });
  }
);
