'use strict';

angular.module('angularLeap')

    .factory('leapHelperService', function ($timeout,leap) {
        var timeoutActive = false,
            limit = leap.gestureIntense();

        var getMovements = function (gesture) {
            var xdiff = gesture.startPosition[0] - gesture.position[0],
                ydiff = gesture.startPosition[1] - gesture.position[1],
                zdiff = gesture.startPosition[2] - gesture.position[2];

            var movement = {
                x: {
                    distance: Math.abs(xdiff),
                    type: (xdiff > 0) ? 'left' : 'right',
                    direction: xdiff
                },
                y: {
                    distance: Math.abs(ydiff),
                    type: (ydiff > 0) ? 'down' : 'up',
                    direction: ydiff
                },
                z: {
                    distance: Math.abs(zdiff),
                    type: (zdiff > 0) ? 'forward' : 'backward',
                    direction: zdiff
                }
            };

            movement.swipe = {
                left: (xdiff > 0) && movement.x.distance > limit,
                right: (xdiff < 0) && movement.x.distance > limit,
                up: (ydiff < 0) && movement.y.distance > limit,
                down: (ydiff > 0) && movement.y.distance > limit,
                forward: (zdiff < 0) && movement.z.distance > limit,
                backward: (zdiff > 0) && movement.z.distance > limit
            }

            return movement;
        }

        var testForDirection = function (gestureEvent, direction) {
            var movements = getMovements(gestureEvent);
            return movements.swipe[direction.toLowerCase()];
        };

        var timeoutHandler = function (ms) {
            var beforeState = timeoutActive;
            if (!timeoutActive && ms) {
                timeoutActive = true;
                $timeout(function () {
                    timeoutActive = false;
                }, ms);
            }
            return beforeState;
        };

        return {
            testForDirection: testForDirection,
            timeout: timeoutHandler
        };
    })
;
