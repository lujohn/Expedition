describe('PlayerService Tests', function () {
	beforeEach(module('expeditionApp'));

	var PlayerService, LandFactory, BuildingFactory;

	beforeEach(inject(function(_PlayerService_, _LandFactory_, _BuildingFactory_) {
		PlayerService = _PlayerService_;
		LandFactory = _LandFactory_;
		BuildingFactory = _BuildingFactory_;
	}));

	describe('tests addLand function', function () {
		it('should add ore and brick to red player', function () {
			var land1 = LandFactory.createLand("ore");
			var land2 = LandFactory.createLand("brick");
			land1.landID = "land1";
			land1.diceNumber = 2;
			land2.landID = "land2";
			land2.diceNumber = 2;
			var player = PlayerService.createPlayer("red");

			// Check that player was created successfully
			expect(player.color).toBe("red");
			expect(player.roadsOwned).toEqual([]);
			expect(player.buildingsOwned).toEqual([]);
			expect(player.victoryPoints).toBe(2);

			// Add ore to player
			player.addLand(land1);
			player.addLand(land2);
			var lands = player.landsForDiceNumber[2];
			expect(lands.length).toBe(2);  // should be ["ore", "brick"]

			expect(lands[0].type).toBe("ore");
			expect(lands[1].type).toBe("brick");

			// No duplicates
			expect(player.addLand(land1)).toBeFalsy();
		});

		// --------------------- Add more tests here --------------------------
	})

	describe('tests addRoad function', function () {
		it('should add a road to blue player', function () {
			var blueRoad = BuildingFactory.createRoad("blue",[0,0],[0,0]);
			var player = PlayerService.createPlayer("blue");
			player.addRoad(blueRoad);

			expect(player.roadsOwned.length).toBe(1);
			expect(player.roadsOwned[0].color).toBe("blue");
		});

		// --------------------- Add more tests here --------------------------
	});

	describe('tests addBuilding function', function() {
		it('should add a settlement and city to yellow player', function () {
			var settlement = BuildingFactory.createBuilding("yellow");
			var city = BuildingFactory.createBuilding("yellow");
			city.type = "city";

			var player = PlayerService.createPlayer("yellow");
			player.addBuilding(settlement);
			player.addBuilding(city);

			expect(player.buildingsOwned.length).toBe(2);
			expect(player.buildingsOwned[0].type).toBe("settlement"); 
			expect(player.buildingsOwned[1].type).toBe("city");
		});
		// --------------------- Add more tests here --------------------------
	});

	describe('tests diceRolled function which increments the players\'s resourses', function () {
		it('should increment the amount of wheat to 2', function () {
			var wheat1 = LandFactory.createLand("wheat");
			var brick1 = LandFactory.createLand("brick");
			var wood1 = LandFactory.createLand("wood");
			var player = PlayerService.createPlayer("red");
			wheat1.diceNumber = 5;
			brick1.diceNumber = 2;
			wood1.diceNumber = 2;

			player.addLand(wheat1);
			player.addLand(brick1);
			player.addLand(wood1);

			player.diceRolled(5);
			player.diceRolled(5);
			player.diceRolled(2);

			expect(player.resourcesInHand["wheat"]).toBe(2);
			expect(player.resourcesInHand["brick"]).toBe(1);
			expect(player.resourcesInHand["wood"]).toBe(1);
		});
	});
});