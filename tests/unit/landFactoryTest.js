describe('LandFactory Tests', function () {
	beforeEach(module('expeditionApp'));

	var LandFactory;

	beforeEach(inject(function(_LandFactory_) {
		LandFactory = _LandFactory_;
	}));

	it('should have land type be sheep', function () {
		land = LandFactory.createLand("sheep");
		expect(land.type).toBe("sheep");
	});

	it('should have hasRobber be false', function () {
		land = LandFactory.createLand("wood");
		expect(land.hasRobber).toBeFalsy();
	});
} );