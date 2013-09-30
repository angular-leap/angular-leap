describe("A leapConfig Value", function () {
    beforeEach(module('angular-leap'));

    it("should contain a defaultTimeout value", inject(function (leapConfig) {
        expect(leapConfig.defaultTimeout).toBeDefined();
    }));

    it("should contain a defaultTimeout value of 650", inject(function (leapConfig) {
        expect(leapConfig.defaultTimeout).toBe(650);
    }));


    it("should contain a defaultTimeout value", inject(function (leapConfig) {
        expect(leapConfig.defaultGestureIntense).toBeDefined();
    }));

    it("should contain a defaultTimeout value of 650", inject(function (leapConfig) {
        expect(leapConfig.defaultGestureIntense).toBe(0.5);
    }));
});