describe("A leapHelperService", function() {
    beforeEach(module('angular-leap'));

    it("should offer a timeout function", inject(function(leapHelperService) {
        expect(leapHelperService.timeout).toBeDefined();
    }));

});