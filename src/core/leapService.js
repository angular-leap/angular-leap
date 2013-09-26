angular.module("leap").service('leap', function () {
    if (angular.isUndefined(Leap)) {
        throw new Error("You should include LeapJS Native JavaScript API");
    }
    var controller = new Leap.Controller();
    controller.connect();
    return controller;
});