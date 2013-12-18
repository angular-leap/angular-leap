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

            describe('key: timeout', function () {
                it('should define a timeout function', inject(function (leap) {
                    expect(leap.timeout).toBeDefined();
                }));

                it('should define a default timeout at ' + testBasicConfiguration.timeout, inject(function (leap) {
                    expect(leap.timeout()).toBe(testBasicConfiguration.timeout);
                }));

                it('should define a getter/setter', inject(function (leap) {
                    var tempValue = leap.timeout();
                    expect(leap.timeout()).toBe(tempValue);
                    expect(leap.timeout(tempValue + 100)).not.toBe(tempValue);
                    expect(leap.timeout(tempValue + 100)).toBe(tempValue + 100);
                    expect(leap.timeout()).toBe(tempValue + 100);
                }));

            });


            describe('key: gestureIntense', function () {
                it('should define a gestureIntense function', inject(function (leap) {
                    expect(leap.gestureIntense).toBeDefined();
                }));

                it('should define a default gestureIntense at ' + testBasicConfiguration.gestureIntense, inject(function (leap) {
                    expect(leap.gestureIntense()).toBe(testBasicConfiguration.gestureIntense);
                }));

                it('should define a getter/setter', inject(function (leap) {
                    var tempValue = leap.gestureIntense();
                    expect(leap.gestureIntense()).toBe(tempValue);
                    expect(leap.gestureIntense(tempValue + 100)).not.toBe(tempValue);
                    expect(leap.gestureIntense(tempValue + 100)).toBe(tempValue + 100);
                    expect(leap.gestureIntense()).toBe(tempValue + 100);
                }));

            });


        });

    });

    describe('configured instance', function () {
        beforeEach(module('angularLeap', function (leapProvider) {
            leapProvider.timeout(testBasicConfiguration.timeout + 1);
        }));
        describe('key: timeout', function () {
            it('should define a default timeout function', inject(function (leap) {
                expect(leap.timeout).toBeDefined();
            }));

            it('should define a default timeout at ' + testBasicConfiguration.timeout + '+ 1', inject(function (leap) {
                expect(leap.timeout()).toBe(testBasicConfiguration.timeout + 1);
            }));
        });
    });


    describe('configured instance', function () {
        beforeEach(module('angularLeap', function (leapProvider) {
            leapProvider.gestureIntense(testBasicConfiguration.gestureIntense + 1);
        }));
        describe('key: timeout', function () {
            it('should define a default gestureIntense function', inject(function (leap) {
                expect(leap.gestureIntense).toBeDefined();
            }));

            it('should define a default gestureIntense at ' + testBasicConfiguration.gestureIntense + '+ 1', inject(function (leap) {
                expect(leap.gestureIntense()).toBe(testBasicConfiguration.gestureIntense + 1);
            }));
        });
    });


});




