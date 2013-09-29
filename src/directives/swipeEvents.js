// Directive generator
var eventDirectives = {};
angular.forEach(['Left', 'Right', 'Up', 'Down'],
    function (direction) {
        'use strict';
        var directiveName = 'leapSwipe' + direction;
        eventDirectives[directiveName] = [
            '$parse', 'leap', 'leapHelperService', function ($parse, leap, leapHelperService) {
                return function (scope, element, attr) {
                    var fn = $parse(attr[directiveName]);
                    leap.controller().on('gesture', function (gesture) {
                        if (!leapHelperService.timeout(650) && gesture.type === "swipe" && leapHelperService.testForDirection(gesture, direction)) {
                            scope.$apply(function () {
                                fn(scope, {$gesture: gesture});
                            });
                        }
                    });
                };
            }];
    }
);


angular.module('angular-leap').directive(eventDirectives);