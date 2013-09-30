'use strict';
var tapEventDirectives = {};
angular.forEach(['Key', 'Screen'],
    function (tapType) {
        var directiveName = 'leap' + tapType + "Tap";
        tapEventDirectives[directiveName] = function ($parse, leap, leapHelperService, leapConfig) {
            return function (scope, element, attr) {
                var fn = $parse(attr[directiveName]);
                leap.controller().on('gesture', function (gesture) {
                    var timeout = (attr.leapTimeout) ? attr.leapTimeout : leapConfig.defaultTimeout;
                    if (!leapHelperService.timeout(timeout) &&
                        gesture.type === tapType.toLowerCase() + "Tap") {
                        scope.$apply(function () {
                            fn(scope, {$gesture: gesture});
                        });
                    }
                });
            };
        };
    }
);


angular.module('angular-leap').directive(tapEventDirectives);