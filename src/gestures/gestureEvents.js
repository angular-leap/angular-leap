'use strict';
angular.forEach([
    'leapKeyTap',
    'leapScreenTap',
    'leapCircle',
    'leapSwipeLeft',
    'leapSwipeRight',
    'leapSwipeUp',
    'leapSwipeDown'],
    function (directiveName) {
        angular.module('angular-leap').directive(directiveName, function ($parse, leap, leapHelperService, leapConfig) {
            return function (scope, element, attr) {
                var fn = $parse(attr[directiveName]);
                leap.controller().on('gesture', function (gesture) {
                    var timeout = (attr.leapTimeout) ? attr.leapTimeout : leapConfig.defaultTimeout,
                    // Split by CamelCase
                        splitByCamelCase = directiveName.replace(/([A-Z])/g, ' $1').split(' '),
                        eventType;
                    if (splitByCamelCase[2] === 'Tap') {
                        eventType = splitByCamelCase[1].toLowerCase() + splitByCamelCase[2];
                    } else {
                        eventType = splitByCamelCase[1].toLowerCase();
                    }
                    if (!leapHelperService.timeout(timeout) &&
                        gesture.type === eventType) {
                        if (eventType === 'swipe' &&
                            leapHelperService.testForDirection(gesture, splitByCamelCase[2].toLowerCase())) {
                            return;
                        }
                        scope.$apply(function () {
                            fn(scope, {$gesture: gesture});
                        });
                    }
                });
            };
        });
    });
