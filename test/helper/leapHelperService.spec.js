describe("A leapHelperService", function () {
    beforeEach(module('angular-leap'));

    it("should offer a testForDirection function", inject(function (leapHelperService) {
        expect(leapHelperService.testForDirection).toBeDefined();
    }));

    describe("testForDirection function", function () {

        var directions = ["left", "right", "up", "down"];


        it("should detect direction", inject(function (leapHelperService) {

            var testEventsFor = {
                left : {direction: [1, 0]},
                right: {direction: [-1, 0]},
                up   : {direction: [0, 1]},
                down : {direction: [0, -1]}
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
            expect(leapHelperService.testForDirection(testEventsFor['leftMin'], "left")).toBe(false);
            expect(leapHelperService.testForDirection(testEventsFor['leftMax'], "left")).toBe(true);


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
    })


});