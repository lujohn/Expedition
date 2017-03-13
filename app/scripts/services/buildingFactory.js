angular.module('expeditionApp')
.factory('BuildingFactory', function() {

	var buildingFactory = {};

	// Create new road
	buildingFactory.createRoad = function (color, vertex1, vertex2) {
		var newRoad = {};
		newRoad.color = color;
		newRoad.from = vertex1;
		newRoad.to = vertex2;

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