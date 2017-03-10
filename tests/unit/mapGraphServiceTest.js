
describe('MapGraphService Tests', function () {

	beforeEach(module('expeditionApp'));

	var MapGraphService;

	beforeEach(inject(function (_MapGraphService_) {
		MapGraphService = _MapGraphService_;
	}));

	/* ------------------------- Test hasEdge() -------------------------- */
	it('tests hasEdge() function', function () {
		MapGraphService.addVertex([80,0]);
		MapGraphService.addVertex([160,0]);
		MapGraphService.addVertex([0,40]);

		MapGraphService.addEdge("blue", [80,0], [0,40]);
		MapGraphService.addEdge("blue", [0,40], [160,0]);
		MapGraphService.addEdge("blue", [160,0], [80,0]);

		expect(MapGraphService.hasEdge([80,0], [0,40])).toBeTruthy();
		expect(MapGraphService.hasEdge([0,40], [80,0])).toBeTruthy();
		expect(MapGraphService.hasEdge([0,40], [160,0])).toBeTruthy();
		expect(MapGraphService.hasEdge([160,0], [0,40])).toBeTruthy();
		expect(MapGraphService.hasEdge([160,0], [80,0])).toBeTruthy();
		expect(MapGraphService.hasEdge([80,0], [160,0])).toBeTruthy();

		expect(MapGraphService.hasEdge([12, 23], [160,0])).toBeFalsy();
	});

	/* ------------------------- Test hasVertex() -------------------------- */
	it('tests hasVertex() function', function () {
		MapGraphService.addVertex([80,0]);
		expect(MapGraphService.hasVertex([80,0])).toBeTruthy();

		// non-existent vertex
		expect(MapGraphService.hasVertex([20,30])).toBeFalsy();
	});

	/* ------------------------- Test addVertex() -------------------------- */
	describe('tests addVertex() function', function () {
		it ('should add vertex "80,0" to graph', function () {
			var addSuccessful = MapGraphService.addVertex([80,0]);
			expect(addSuccessful).toBeTruthy();

			expect(MapGraphService.verticies["80,0"]).toBeDefined();
			expect(MapGraphService.verticies["80,0"].color).toEqual(null);
			expect(MapGraphService.verticies["80,0"].type).toEqual(null);
			expect(MapGraphService.verticies["80,0"].available).toBeTruthy();
		});

		it ('should add vertex "80,0" and reject duplicate add to graph, then add [160,80]', function () {
			MapGraphService.addVertex([80,0]);
			var addSuccessful = MapGraphService.addVertex([80,0]);
			expect(addSuccessful).toBeFalsy();

		});

		it ('should add vertex [80,0] then add [160,80]', function () {
			MapGraphService.addVertex([80,0]);
			addSuccessful = MapGraphService.addVertex([160,80]);
			expect(addSuccessful).toBeTruthy(); 
			expect(Object.keys(MapGraphService.verticies).length).toBe(2);
			expect(Object.keys(MapGraphService.edges).length).toBe(2);
		});
	});

	/* ------------------------- Test addEdge() -------------------------- */
	describe('tests addEdge() function', function () {

		it ('should add edge from [80,0] to [0,80]', function () {
			MapGraphService.addVertex([80,0]);
			MapGraphService.addVertex([0,80]);

			var addSuccess = MapGraphService.addEdge("red", [80,0], [0,80]);
			expect(addSuccess).toBeTruthy();
			//expect(MapGraphService.edges)
		});

		it ('should reject duplicate edge', function () {
			MapGraphService.addVertex([80,0]);
			MapGraphService.addVertex([0,80]);

			// Attempt adding duplicate edges - should return false;
			MapGraphService.addEdge("red", [80,0], [0,80]);
			var addSuccess = MapGraphService.addEdge("blue", [80,0], [0,80]);
			expect(addSuccess).toBeFalsy();

			addSuccess = MapGraphService.addEdge("red", [0,80], [80,0]);
			expect(addSuccess).toBeFalsy();
		});

		it ('should add multiple edges to [80,0]', function () {
			MapGraphService.addVertex([80,0]);
			MapGraphService.addVertex([160,0]);
			MapGraphService.addVertex([0,40]);

			MapGraphService.addEdge("blue", [80,0], [0,40]);
			MapGraphService.addEdge("red", [80,0], [160,0]);

			expect(MapGraphService.edges["80,0"]["0,40"]).toBe("blue");
			expect(MapGraphService.edges["160,0"]["80,0"]).toBe("red");
		});
	});

	/* ------------------------- Test getVertex() -------------------------- */
	describe('tests getVertex() function', function () {

		it ('should be able to retreive vertex [80,0]', function () {
			MapGraphService.addVertex([80,0]);

			expect(MapGraphService.getVertex([80,0]) === null).toBeFalsy();
			expect(MapGraphService.getVertex([80,0]).available).toBeTruthy();
		});

		it ('should not be able to retrieve vertex [100, 20] - does not exist', function () {
			MapGraphService.addVertex([80,0]);
			expect(MapGraphService.getVertex([100,20]) === null).toBeTruthy();
		});

	});

	/* ------------------------- Test getEdges() -------------------------- */
	describe('tests getEdges() function', function () {

		it ('should be able to retrieve all 3 edges for [80,0]', function () {
			MapGraphService.addVertex([80,0]);
			MapGraphService.addVertex([160,0]);
			MapGraphService.addVertex([0,40]);
			MapGraphService.addVertex([60,120]);

			MapGraphService.addEdge("blue", [80,0], [0,40]);
			MapGraphService.addEdge("red", [80,0], [160,0]);
			MapGraphService.addEdge("yellow", [80,0], [60,120]);

			var edges = MapGraphService.getEdges([80,0]);
			expect(edges["0,40"]).toBe("blue");
			expect(edges["160,0"]).toBe("red");
			expect(edges["60,120"]).toBe("yellow");

			// Should only be three edges here
			expect(Object.keys(edges).length).toBe(3);
		});
	});

	/* -------------------------- Test setEdge() -------------------------- */
	it('should change the edges color from null to "red', function () {
		var v1 = [80,0];
		var v2 = [160,0];
		MapGraphService.addVertex(v1);
		MapGraphService.addVertex(v2);

		MapGraphService.addEdge(null, v1, v2);
		MapGraphService.setEdge("red", v1, v2); // change color to "red"
		expect(MapGraphService.getEdgeColor(v1,v2)).toBe("red");
	});

	/* ------------------------- Test setVertex() ------------------------- */
	it('should change vertex color from null to "blue" and type from null to "settlement"', function () {
		var v1 = [80,0];
		MapGraphService.addVertex(v1);

		MapGraphService.setVertex("blue", "settlement", v1);
		expect(MapGraphService.getVertex(v1).color).toBe("blue");
		expect(MapGraphService.getVertex(v1).type).toBe("settlement");
	});
});