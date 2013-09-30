'use strict';
var circleDirectives = {};
angular.forEach(['Circle'],
    function (eventType) {
        var directiveName = 'leap' + eventType;
        circleDirectives[directiveName] = function ($parse, leap, leapHelperService, leapConfig) {
            return function (scope, element, attr) {
                var fn = $parse(attr[directiveName]);
                leap.controller().on('gesture', function (gesture) {
                    var timeout = (attr.leapTimeout) ? attr.leapTimeout : leapConfig.defaultTimeout;
                    if (!leapHelperService.timeout(timeout) &&
                        gesture.type === eventType.toLowerCase()) {
                        scope.$apply(function () {
                            fn(scope, {$gesture: gesture});
                        });
                    }
                });
            };
        };
    }
);


angular.module('angular-leap').directive(circleDirectives);