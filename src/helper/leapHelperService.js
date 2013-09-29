angular.module('angular-leap').service("leapHelperService", [
    '$timeout', function ($timeout) {
        'use strict';
        // TODO: Make Configurable
        var limit = 0.5,
            timeOut = 650,
            timeoutActive = false,

            testForDirection = function (gestureEvent, direction) {
                var directionHorizontal = gestureEvent.direction[0],
                    directionVertical = gestureEvent.direction[1],

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
                    }, timeOut);
                }
                return beforeState;
            };

        return {
            testForDirection: testForDirection,
            timeout         : timeoutHandler
        };
    }]);