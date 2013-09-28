describe("A leapHelperService", function() {
    beforeEach(module('angular-leap'));

    it("should offer a timeout function", inject(function(leapHelperService) {
        expect(leapHelperService.timeout).toBeDefined();
    }));

    describe("timeout function", function() {

        it("should return false if no timeout is active", inject(function(leapHelperService,$timeout) {
            expect(leapHelperService.timeout()).toBe(false);
        }));

        // TODO: Function not so clear, rename/refactor
        it("should return current active state on call", inject(function(leapHelperService,$timeout) {
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