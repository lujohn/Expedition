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

	/* ------------------- Test addAllVerticiesInHexToGraph() --------------------- */
	it('tests addAllVerticiesInHexToGraph() function', function () {
		var xOffset = 0;
		var yOffset = 0;
		var hexCoordinates = {
            A: [80 + xOffset, 0 + yOffset],
            B: [160 + xOffset, 40 + yOffset],
            C: [160 + xOffset, 120 + yOffset],
            D: [80 + xOffset, 160 + yOffset],
            E: [0 + xOffset, 120 + yOffset],
            F: [0 + xOffset, 40 + yOffset]
        };

        MapService.addAllVerticiesInHexToGraph(hexCoordinates);

        expect(MapGraphService.hasVertex([80,160])).toBeTruthy();
        expect(MapGraphService.getVertex([0,40]).color === null).toBeTruthy();

        // A and B should not be added again. But C-F should be added
        xOffset = 10;
        yOffset = 10;
        var hexCoordinates2 = {
            A: [80, 0],
            B: [160, 40],
            C: [160 + xOffset, 120 + yOffset],
            D: [80 + xOffset, 160 + yOffset],
            E: [0 + xOffset, 120 + yOffset],
            F: [0 + xOffset, 40 + yOffset]
        };

        MapService.addAllVerticiesInHexToGraph(hexCoordinates2);

        expect(MapGraphService.hasVertex([170,130])).toBeTruthy();
        expect(MapGraphService.getVertex([90,170]).color === null).toBeTruthy();
	});

	/* -------------------- Test addAllEdgesFromHexToGraph() --------------------- */
	it('tests addAllEdgesFromHexToGraph', function () {
		var xOffset = 0;
		var yOffset = 0;
		var hexCoordinates = {
            A: [80 + xOffset, 0 + yOffset],
            B: [160 + xOffset, 40 + yOffset],
            C: [160 + xOffset, 120 + yOffset],
            D: [80 + xOffset, 160 + yOffset],
            E: [0 + xOffset, 120 + yOffset],
            F: [0 + xOffset, 40 + yOffset]
        };
        MapService.addAllVerticiesInHexToGraph(hexCoordinates);
        MapService.addAllEdgesFromHexToGraph(hexCoordinates);
        expect(MapGraphService.hasEdge([80,0], [160,40])).toBeTruthy();
        expect(MapGraphService.hasEdge([160,120], [80,160])).toBeTruthy();
        expect(MapGraphService.hasEdge([0,40],[80,0])).toBeTruthy();
        expect(MapGraphService.hasEdge([80,0], [80,160])).toBeFalsy();

        xOffset = 10;
        yOffset = 10;
        var hexCoordinates2 = {
            A: [80, 0],
            B: [160, 40],
            C: [160 + xOffset, 120 + yOffset],
            D: [80 + xOffset, 160 + yOffset],
            E: [0 + xOffset, 120 + yOffset],
            F: [0 + xOffset, 40 + yOffset]
        };
        MapService.addAllVerticiesInHexToGraph(hexCoordinates2);
        MapService.addAllEdgesFromHexToGraph(hexCoordinates2);
        expect(MapGraphService.hasEdge([10,50], [80,0])).toBeTruthy();
        expect(MapGraphService.hasEdge([10,130], [10,50])).toBeTruthy();
        expect(MapGraphService.hasEdge([160,40],[80,0])).toBeTruthy();
        expect(MapGraphService.hasEdge([80,0], [10,130])).toBeFalsy();

	});
});