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
      eventType = splitByCamelCase[1].toLowerCase();

    if (splitByCamelCase[2]) {
      eventType += splitByCamelCase[2];
    }
    if (splitByCamelCase[3]) {
      eventType += splitByCamelCase[3];
    }

    angular.module('angularLeap').directive(directiveName, function ($parse, leap) {
      return function (scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        var timeout = (attr.leapTimeout) ? attr.leapTimeout : leap.config().defaultTimeout;

        leap.onGesture(directiveName, function (gesture) {
          if (!leap.fn.timeout(timeout)) {
            scope.$apply(function () {
              fn(scope, {$gesture: gesture});
            });
          }
        });
      };
    });
  }
);
