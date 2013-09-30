'use strict';
var swipeEventDirectives = {};
angular.forEach(['Left', 'Right', 'Up', 'Down'],
    function (direction) {
        var directiveName = 'leapSwipe' + direction;
        swipeEventDirectives[directiveName] = function ($parse, leap, leapHelperService, leapConfig) {
            return function (scope, element, attr) {
                var fn = $parse(attr[directiveName]);
                leap.controller().on('gesture', function (gesture) {
                    var timeout = (attr.leapTimeout) ? attr.leapTimeout : leapConfig.defaultTimeout;
                    if (!leapHelperService.timeout(timeout) &&
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


angular.module('angular-leap').directive(swipeEventDirectives);