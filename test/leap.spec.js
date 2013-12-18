describe('A leapService', function () {

    /* Test basic configurations */
    var testBasicConfiguration = {
        timeout: 650,
        gestureIntense: 0.5
    };

    describe('default instance', function () {
        beforeEach(module('angularLeap'));

        it('should throw an exception if global variant Leap is not defined', inject(function ($injector, $window) {

            var invokeLeapService = function () {
                $injector.invoke(function (leap) {
                });
            };

            $window.Leap = undefined;
            expect($window.Leap).not.toBeDefined();
            expect(invokeLeapService).toThrow(new Error('You should include LeapJS Native JavaScript API'));
        }));

        describe('that could use global Leap Variant', function () {


            var _Leap;
            var _LeapController;

            beforeEach(inject(function ($window) {
                _LeapController = function () {
                };
                _LeapController.prototype.connect = function () {
                };


                _Leap = function () {
                };
                _Leap.Controller = _LeapController;

                $window.Leap = _Leap;
            }));


            it('should offer a controller function', inject(function ($injector) {

                var leapController;
                $injector.invoke(function (leap) {
                    leapController = leap;
                });

                expect(leapController.controller).toBeDefined();
            }));


            it('should call LeapController.connect on call of controller', inject(function ($injector) {
                var leapController;
                spyOn(_LeapController.prototype, 'connect');

                $injector.invoke(function (leap) {
                    leapController = leap;
                });

                leapController.controller();

                expect(_LeapController.prototype.connect).toHaveBeenCalled();
            }));


            it('should call LeapController.connect only once', inject(function ($injector) {
                var leapController;
                spyOn(_LeapController.prototype, 'connect');

                $injector.invoke(function (leap) {
                    leapController = leap;
                });

                leapController.controller();
                leapController.controller();
                leapController.controller();

                expect(_LeapController.prototype.connect.calls.length).toBe(1);
            }));
        });

        describe('configuration', function () {


            var _Leap;
            var _LeapController;

            beforeEach(inject(function ($window) {
                _LeapController = function () {
                };
                _LeapController.prototype.connect = function () {
                };


                _Leap = function () {
                };
                _Leap.Controller = _LeapController;

                $window.Leap = _Leap;
            }));

            for (var key in testBasicConfiguration) {
                if (testBasicConfiguration.hasOwnProperty(key)) {
                    var value = testBasicConfiguration[key];

                    describe('key: ' + key, function () {
                        it('should define a default ' + key + ' function', inject(function (leap) {
                            expect(leap[key]).toBeDefined();
                        }));

                        it('should define a default ' + key + ' at ' + value, inject(function (leap) {
                            expect(leap[key]()).toBe(value);
                        }));

                        it('should define a getter/setter', inject(function (leap) {
                            var tempValue = leap[key]();
                            expect(leap[key]()).toBe(tempValue);
                            expect(leap[key](tempValue + 100)).not.toBe(tempValue);
                            expect(leap[key](tempValue + 100)).toBe(tempValue + 100);
                            expect(leap[key]()).toBe(tempValue + 100);
                        }));

                    });

                }
            }


        });

    });

    describe('configured instance', function () {
        beforeEach(module('angularLeap', function (leapProvider) {
            for (var key in testBasicConfiguration) {
                if (testBasicConfiguration.hasOwnProperty(key)) {
                    var value = testBasicConfiguration[key];
                    leapProvider[key](value + 1);
                }
            }
        }));

        for (var key in testBasicConfiguration) {
            if (testBasicConfiguration.hasOwnProperty(key)) {
                var value = testBasicConfiguration[key];
                describe('key: ' + key, function () {
                    it('should define a default timeout function', inject(function (leap) {
                        expect(leap[key]).toBeDefined();
                    }));

                    it('should define a default timeout at ' + value + '+ 1', inject(function (leap) {
                        expect(leap[key]()).toBe(value + 1);
                    }));
                });

            }
        }
    });


});




