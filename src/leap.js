'use strict';

angular.module('angularLeap')
    .provider('leap', function () {

        var timeOutFn,
            gestureIntenseFn,
            // Defaults
            _timeout = 650,
            _gestureIntense = 0.5;

        this.timeout = timeOutFn = function (timeout) {
            if (timeout) {
                _timeout = timeout;
            }
            return _timeout;
        };

        this.gestureIntense = gestureIntenseFn = function (gestureIntense) {
            if (gestureIntense) {
                _gestureIntense = gestureIntense;
            }
            return _gestureIntense;
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
                timeout: timeOutFn,
                gestureIntense: gestureIntenseFn
            };
        };

    });
