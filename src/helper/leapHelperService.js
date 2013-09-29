angular.module('angular-leap').service("leapHelperService", [
    '$timeout', function ($timeout) {
        var testForDirection = function (gestureEvent, direction) {
            // TODO: Make Configurable
            var limit = 0.5;
            var directionHorizontal = gestureEvent.direction[0];
            var directionVertical = gestureEvent.direction[1];

            var directionDefinition = {
                Left : directionHorizontal > limit,
                Right: -directionHorizontal > limit,
                Up   : directionVertical > limit,
                Down : -directionVertical > limit
            };

            return directionDefinition[direction];
        };

        // TODO: Make Configurable
        var timeOut = 650;
        var timeoutActive = false;


        var timeoutHandler = function (ms) {
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
        }
    }]);