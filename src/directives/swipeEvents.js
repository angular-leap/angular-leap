'use strict';
var eventDirectives = {};
angular.forEach(['Left', 'Right', 'Up', 'Down'],
    function (direction) {
        var directiveName = 'leapSwipe' + direction;
        eventDirectives[directiveName] = function ($parse, leap, leapHelperService, leapConfig) {
            return function (scope, element, attr) {
                var fn = $parse(attr[directiveName]);
                leap.controller().on('gesture', function (gesture) {
                    if (!leapHelperService.timeout(leapConfig.defaultTimeOut) &&
                        gesture.type === "swipe" &&
                        leapHelperService.testForDirection(gesture, direction)) {
                        scope.$apply(function () {
                            fn(scope, {$gesture: gesture});
                        });
                    }
                });
            };
        };
    }
);


angular.module('angular-leap').directive(eventDirectives);