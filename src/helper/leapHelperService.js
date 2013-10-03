'use strict';
angular.module('angular-leap').factory("leapHelperService", function ($timeout, leapConfig) {
    var timeoutActive = false,

        testForDirection = function (gestureEvent, direction) {
            var directionHorizontal = gestureEvent.direction[0],
                directionVertical = gestureEvent.direction[1],
                limit = leapConfig.defaultGestureIntense,

                directionDefinition = {
                    Left : directionHorizontal > limit,
                    Right: -directionHorizontal > limit,
                    Up   : directionVertical > limit,
                    Down : -directionVertical > limit
                };

            return directionDefinition[direction];
        },

        timeoutHandler = function (ms) {
            var beforeState = timeoutActive;
            if (!timeoutActive && ms) {
                timeoutActive = true;
                $timeout(function () {
                    timeoutActive = false;
                }, ms);
            }
            return beforeState;
        },

        splitByCamelCase = function (inputString) {
            return inputString.replace(/([A-Z])/g, ' $1').split(' ');
        };

    return {
        testForDirection: testForDirection,
        timeout         : timeoutHandler,
        splitByCamelCase: splitByCamelCase
    };
});