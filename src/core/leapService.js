angular.module("angular-leap").service('leap', function ($window) {
    if (!$window.Leap) {
        throw new Error("You should include LeapJS Native JavaScript API");
    }

    var controller;
    var getController = function(){
        if(!controller){
            controller = new $window.Leap.Controller();
            controller.connect();
        }
        return controller;
    }

    return {
        controller: getController
    };
});