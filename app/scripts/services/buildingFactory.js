angular.module('expeditionApp')
.factory('BuildingFactory', function() {

	var buildingFactory = {};

	// Create new road
	buildingFactory.createRoad = function (color, coord1, coord2) {
		var newRoad = {};
		newRoad.color = color;
		newRoad.from = coord1;
		newRoad.to = coord2;

		newRoad.toString = function () {
			return "from: " + newRoad.from + " to: " + newRoad.to +  " color: " + newRoad.color;
		}
		return newRoad;
	};

	// Create a new Settlement
	buildingFactory.createBuilding = function (color, vertex) {
		var newBuilding = {};
		newBuilding.location = vertex;
		newBuilding.color = color;
		newBuilding.type = "settlement";

		newBuilding.toString = function() {
			return "location: " + newBuilding.location + ", color: " + newBuilding.color + ", type: " + newBuilding.type;
		}

		return newBuilding;
	};

	return buildingFactory;
	
});