angular.module('expeditionApp')
.factory('BuildingFactory', function() {

	var buildingFactory = {};

	// Create new road
	buildingFactory.createRoad = function (color, coord1, coord2) {
		var newRoad = {};
		newRoad.color = color;
		newRoad.from = coord1;
		newRoad.to = coord2;

		// ** For Debugging **
		newRoad.toString = function () {
			return "from: " + newRoad.from + " to: " + newRoad.to +  " color: " + newRoad.color;
		};
		return newRoad;
	};

	// Create a new Settlement
	buildingFactory.createBuilding = function (color, coordinates) {
		var newBuilding = {};
		newBuilding.location = coordinates;
		newBuilding.color = color;
		newBuilding.type = "settlement";

		// The lands the building sits on. This property helps with incrementing
		// the player's resources when the corresponding dice number is rolled. See PlayerService.
		newBuilding.lands = {};

		// ** For Debugging **
		newBuilding.toString = function() {
			return "location: " + newBuilding.location + ", color: " + newBuilding.color + ", type: " + newBuilding.type;
		};

		return newBuilding;
	};

	return buildingFactory;
	
});