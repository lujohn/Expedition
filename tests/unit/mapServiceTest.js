describe('MapService Tests', function () {

	beforeEach(module('expeditionApp'));

	var MapService, MapGraphServcie, BuildingFactory;

	beforeEach(inject(function (_MapService_, _MapGraphService_, _BuildingFactory_) {
		MapService = _MapService_;
		MapGraphService = _MapGraphService_;
		BuildingFactory = _BuildingFactory_;
	}));

	/* ------------------------- Test addRoadToGraph() -------------------------- */
	it('tests addRoadToGraph() function', function () {
		var v1 = [80,0];
		var v2 = [160,40];
		var v3 = [40,120];
		var road = BuildingFactory.createRoad("yellow", v1, v2);
		var road2 = BuildingFactory.createRoad("red", v2, v3);
		MapGraphService.addVertex(v1);
		MapGraphService.addVertex(v2);
		MapGraphService.addVertex(v3);

		// Add roads
		MapService.addRoadToGraph(road);
		MapService.addRoadToGraph(road2);

		// Check that roads has been added to Graph
		expect(MapGraphService.getEdgeColor(v1, v2)).toBe("yellow");
		expect(MapGraphService.getEdgeColor(v2, v3)).toBe("red");
	});

	/* ----------------------- Test addBuildingToGraph() ------------------------ */
	it('tests addBuildingToGraph() function', function () {
		var v1 = [80,0];
		MapGraphService.addVertex(v1);

		var settlement = BuildingFactory.createBuilding("red", v1);
		MapService.addBuildingToGraph(settlement);

		expect(MapGraphService.getVertex(v1).color).toBe("red");
		expect(MapGraphService.getVertex(v1).type).toBe("settlement");
		expect(MapGraphService.getVertex(v1).available).toBeFalsy();

	});

	/* ------------------------- Test roadExistsAt() ---------------------------- */
	it('tests roadExistsAt() function', function () {
		var v1 = [80,0];
		var v2 = [160,40];
		var v3 = [100,100];
		var road = BuildingFactory.createRoad("yellow", v1, v2);
		MapGraphService.addVertex(v1);
		MapGraphService.addVertex(v2);
		MapGraphService.addVertex(v3);

		// Add roads
		MapService.addRoadToGraph(road);

		// Check that roads exist (both ways)
		expect(MapService.roadExistsAt(v1,v2)).toBeTruthy();
		expect(MapService.roadExistsAt(v2,v1)).toBeTruthy();

		// Test non-existent case
		MapGraphService.addEdge(null, v1,v3);
		expect(MapGraphService.hasEdge(v1,v3)).toBeTruthy(); // shows that edge exists
		expect(MapService.roadExistsAt(v1,v3)).toBeFalsy();  // However, there isn't a road...

	});
	/* ------------------------ Test buildingExistsAt() ------------------------- */
	it('tests buildingExistsAt() function', function () {
		var v1 = [80,0];
		var v2 = [100,100];
		var building = BuildingFactory.createBuilding("red", v1);

		MapGraphService.addVertex(v1);
		MapGraphService.addVertex(v2);

		// Check that building exists
		MapService.addBuildingToGraph(building);
		expect(MapService.buildingExistsAt(v1)).toBeTruthy();

		// Check that there is no building at v2
		expect(MapService.buildingExistsAt(v2)).toBeFalsy();
	});
});