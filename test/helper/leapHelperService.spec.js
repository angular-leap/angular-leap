describe("A leapHelperService", function () {
    beforeEach(module('angular-leap'));

    it("should offer a testForDirection function", inject(function (leapHelperService) {
        expect(leapHelperService.testForDirection).toBeDefined();
    }));

    describe("testForDirection function", function () {

        var directions = ["Left", "Right", "Up", "Down"];


        it("should detect direction", inject(function (leapHelperService) {

            var testEventsFor = {
                Left : {direction: [1, 0]},
                Right: {direction: [-1, 0]},
                Up   : {direction: [0, 1]},
                Down : {direction: [0, -1]}
            }

            for (var i in directions) {
                var currentTestDirection = directions[i];
                expect(currentTestDirection).toBeDefined();

                // Test current = true, else false
                for (var event in testEventsFor) {
                    expect(leapHelperService.testForDirection(testEventsFor[event], currentTestDirection)).toBe(currentTestDirection == event);
                }
            }

        }));


        it("should use a minimum limit for detection", inject(function (leapHelperService) {

            var testEventsFor = {
                leftMin: {direction: [0.1, 0]},
                leftMax: {direction: [1, 0]}
            };
            expect(leapHelperService.testForDirection(testEventsFor['leftMin'], "Left")).toBe(false);
            expect(leapHelperService.testForDirection(testEventsFor['leftMax'], "Left")).toBe(true);


        }));
    });

    it("should offer a timeout function", inject(function (leapHelperService) {
        expect(leapHelperService.timeout).toBeDefined();
    }));

    describe("timeout function", function () {

        it("should return false if no timeout is active", inject(function (leapHelperService, $timeout) {
            expect(leapHelperService.timeout()).toBe(false);
        }));

        // TODO: Function not so clear, rename/refactor
        it("should return current active state on call", inject(function (leapHelperService, $timeout) {
            expect(leapHelperService.timeout()).toBe(false);
            expect(leapHelperService.timeout(100)).toBe(false);
            expect(leapHelperService.timeout(100)).toBe(true);
            expect(leapHelperService.timeout()).toBe(true);
            $timeout.flush();
            expect(leapHelperService.timeout()).toBe(false);
            expect(leapHelperService.timeout(100)).toBe(false);
            expect(leapHelperService.timeout(100)).toBe(true);
            expect(leapHelperService.timeout()).toBe(true);
        }));

        it("should create an timeout with configured time", inject(function ($browser, leapHelperService) {
            spyOn($browser, 'defer');
            var testTime = 1234;
            leapHelperService.timeout(testTime);
            expect($browser.defer.calls[0].args[1]).toBe(testTime);
        }))

        //$browser.defer
    })


});