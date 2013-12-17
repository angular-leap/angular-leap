describe("A leapHelperService", function () {
    beforeEach(module('angularLeap'));

    var directions = ["left", "right", "up", "down", "forward", "backward"],
        i,
        currentTestDirection,
        defaultEvent = {startPosition: [0, 0, 0], type: 'swipe'},
        testEventsFor = {
            left: [-1, 0, 0],
            right: [1, 0, 0],
            up: [0, 1, 0],
            down: [0, -1, 0],
            forward: [0, 0, 1],
            backward: [0, 0, -1]
        };


    describe("testForDirection function", function () {

        it("should be defined", inject(function (leapHelperService) {
            expect(leapHelperService.testForDirection).toBeDefined();
        }));

        describe("direction check", function () {
            for (i in directions) {
                currentTestDirection = directions[i];
                expect(currentTestDirection).toBeDefined();
                for (var event in testEventsFor) {
                    it("should trigger if " + currentTestDirection + "===" + event, inject(function (leapHelperService) {
                            // Test current = true, else false
                            defaultEvent.position = testEventsFor[event];
                            expect(leapHelperService.testForDirection(defaultEvent, currentTestDirection)).toBe(currentTestDirection === event);
                        }
                    ))
                    ;
                }
            }
            ;
        });

        it("should use a minimum limit for detection", inject(function (leapHelperService) {

            defaultEvent.position = [0.1,0,0];
            expect(leapHelperService.testForDirection(defaultEvent, "left")).toBe(false);
            defaultEvent.position = [-1,0,0];
            expect(leapHelperService.testForDirection(defaultEvent, "left")).toBe(true);


        }));

    });


    it("should offer a timeout function", inject(function (leapHelperService) {
        expect(leapHelperService.timeout).toBeDefined();
    }));

    describe("timeout function", function () {

        it("should return false if no timeout is active", inject(function (leapHelperService) {
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
