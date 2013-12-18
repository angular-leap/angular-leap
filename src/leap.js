'use strict';

angular.module('angularLeap')
    .provider('leap', function () {

        var _timeOutFn,
            _gestureIntenseFn,
        // Defaults
            timeout = 650,
            gestureIntense = 0.5;

        this.timeout = _timeOutFn = function (timeoutArgument) {
            if (timeoutArgument) {
                timeout = timeoutArgument;
            }
            return timeout;
        };

        this.gestureIntense = _gestureIntenseFn = function (gestureIntenseArgument) {
            if (gestureIntenseArgument) {
                gestureIntense = gestureIntenseArgument;
            }
            return gestureIntense;
        };


        this.$get = function ($window) {
            if (!$window.Leap) {
                throw new Error('You should include LeapJS Native JavaScript API');
            }

            var controller;

            var getController = function () {
                if (!controller) {
                    controller = new $window.Leap.Controller({enableGestures: true});
                    controller.connect();
                }
                return controller;
            };

            return {
                controller: getController,
                timeout: _timeOutFn,
                gestureIntense: _gestureIntenseFn
            };
        };

    });
