'use strict';
angular.forEach([
  'leapKeyTap',
  'leapScreenTap',
  'leapCircle',
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

    angular.module('angularLeap').directive(directiveName, function ($parse, leap, leapHelperService, leapConfig) {
      return function (scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        var timeout = (attr.leapTimeout) ? attr.leapTimeout : leapConfig.defaultTimeout;

        leap.controller().on('gesture', function (gesture) {
          if (gesture.type === eventType) {
            if (eventType === 'swipe' && !leapHelperService.testForDirection(gesture, direction)) {
              return;
            }
            if (!leapHelperService.timeout(timeout)) {
              scope.$apply(function () {
                fn(scope, {$gesture: gesture});
              });
            }
          }
        });
      };
    });
  }
);
