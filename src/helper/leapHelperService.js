angular.module('angular-leap').service("leapHelperService", [
    '$timeout', function ($timeout) {
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
            timeout: timeoutHandler
        }
    }]);