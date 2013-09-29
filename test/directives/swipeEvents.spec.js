describe("A swipe gesture directive", function () {

    beforeEach(module("angular-leap"));

    var directions = ["left", "right", "up", "down"];

    var _Leap;
    var _LeapController;

    beforeEach(inject(function ($window) {
        _LeapController = function(){};
        _LeapController.prototype.connect = function(){};
        _LeapController.prototype.on = function(){};


        _Leap = function () {};
        _Leap.Controller = _LeapController;

        $window.Leap = _Leap;
    }));

    it("should be executed and register gesture event listener ", inject(function ($rootScope, $compile) {
        spyOn(_LeapController.prototype,"connect");
        spyOn(_LeapController.prototype,"on");

        var html = "<div leap-swipe-" + directions[0] + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);

        expect(_LeapController.prototype.connect).toHaveBeenCalled();
        expect(_LeapController.prototype.on).toHaveBeenCalled();
        expect(_LeapController.prototype.on.calls[0].args[0]).toEqual("gesture");
    }));


    it("should be executed and register gesture event listener ", inject(function ($rootScope, $compile) {
        spyOn(_LeapController.prototype,"on");


        var html = "<div leap-swipe-" + directions[0] + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);


        spyOn(scope,"$apply");
        // Simulate Swipe Event, execute function
        _LeapController.prototype.on.calls[0].args[1]({
            type: "swipe",
            direction:[1,0]
        });

        expect(scope.$apply).toHaveBeenCalled();
    }));


    it("should use the timeout function to prevent unwanted double event triggers", inject(function ($rootScope, $compile,$timeout) {
        spyOn(_LeapController.prototype,"on");


        var html = "<div leap-swipe-" + directions[0] + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);


        spyOn(scope,"$apply");
        // Simulate Swipe Event, execute function
        _LeapController.prototype.on.calls[0].args[1]({
            type: "swipe",
            direction:[1,0]
        });
        _LeapController.prototype.on.calls[0].args[1]({
            type: "swipe",
            direction:[1,0]
        });

        expect(scope.$apply.calls.length).toBe(1);


        $timeout.flush()

        _LeapController.prototype.on.calls[0].args[1]({
            type: "swipe",
            direction:[1,0]
        });

        expect(scope.$apply.calls.length).toBe(2);
    }));



    it("should execute expressions", inject(function ($rootScope, $compile) {
        spyOn(_LeapController.prototype,"on");

        var html = "<div leap-swipe-" + directions[0] + "='test=test+1'></div>";
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);

        scope.test = 1;

        _LeapController.prototype.on.calls[0].args[1]({
            type: "swipe",
            direction:[1,0]
        });

        expect(scope.test).toBe(2);
    }));

    it("should execute scope function", inject(function ($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.testFunction = function(){};
        spyOn(scope,"testFunction");
        spyOn(_LeapController.prototype,"on");

        var html = "<div leap-swipe-" + directions[0] + "='testFunction()'></div>";
        var element = $compile(html)(scope);

        _LeapController.prototype.on.calls[0].args[1]({
            type: "swipe",
            direction:[1,0]
        });

        expect(scope.testFunction).toHaveBeenCalled();
    }));




});