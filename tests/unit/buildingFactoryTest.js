describe('BuidingFactory Tests', function () {
	beforeEach(module('expeditionApp'));

	var BuildingFactory;

	beforeEach(inject(function(_BuildingFactory_) {
		BuildingFactory = _BuildingFactory_;
	}));

	it('should create red settlement', function () {
		var settlement = BuildingFactory.createBuilding("red", [80, 0]);
		expect(settlement.color).toBe("red");
		expect(settlement.type).toBe("settlement");
		expect(settlement.location[0]).toBe(80);
		expect(settlement.location[1]).toBe(0);
	});

	it('should create blue road', function () {
		var road = BuildingFactory.createRoad("blue", [80, 0], [160, 40]);
		expect(road.color).toBe("blue");
		expect(road.from[0]).toBe(80);
		expect(road.from[1]).toBe(0);
		expect(road.to[0]).toBe(160);
		expect(road.to[1]).toBe(40);
	});
});