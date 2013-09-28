ddescribe("A leapService", function () {

    beforeEach(module("angular-leap"));

    it("should throw an exception if global Variant Leap is not defined", inject(function ($injector) {

        var invokeLeapService = function () {
            $injector.invoke(function (leap) {
            });
        }
        expect(invokeLeapService).toThrow();
    }));

    describe("that could use global Leap Variant", function () {


        var _Leap;
        var _LeapController;

        beforeEach(function () {
            _LeapController = function(){};
            _LeapController.prototype.connect = function(){};


            _Leap = function () {};
            _Leap.Controller = _LeapController;

            window.Leap = _Leap;
        });


        it("should offer a controller function", inject(function ($injector) {

            var leapController;
            $injector.invoke(function (leap) {
                leapController = leap;
            });

            expect(leapController.controller).toBeDefined();
        }));


        it("should call LeapController.connect on call of controller", inject(function ($injector) {
            var leapController;
            spyOn(_LeapController.prototype,"connect");

            $injector.invoke(function (leap) {
                leapController = leap;
            });

            leapController.controller();

            expect(_LeapController.prototype.connect).toHaveBeenCalled();
        }));


        it("should call LeapController.connect only once", inject(function ($injector) {
            var leapController;
            spyOn(_LeapController.prototype,"connect");

            $injector.invoke(function (leap) {
                leapController = leap;
            });

            leapController.controller();
            leapController.controller();
            leapController.controller();

            expect(_LeapController.prototype.connect.calls.length).toBe(1);
        }));



    });
})