angular.module('expeditionApp')
.controller('BuildController', ['$scope', 'BuildingFactory', 'MapService', 'GameService',
 function ($scope, BuildingFactory, MapService, GameService) {



	$scope.presentBuildSettlementMenu = function ( ){
		// implement
	}

	$scope.buildSettlement = function (corner) {

		// Get information about land to add land to map graph
		var landToBuildOn = $scope.lastLandSelected;   // Inherited from MapController
		var coordOfCorner = landToBuildOn.coordinates[corner];

		// Get the active player
		var activePlayer = $scope.activePlayer;  // Inherited from MapController
		console.log(activePlayer.color + " wants to build on " + landToBuildOn.landID + " at corner: " + corner + coordOfCorner);

		// Create a Settlement
		var newBuilding = BuildingFactory.createBuilding(activePlayer.color, coordOfCorner);
		console.log("new building created: " +  newBuilding.toString());

		// Add to map
		MapService.addBuildingToGraph(newBuilding);

		if (GameService.STATE === 0) {
			$scope.$parent.SHOW_BUILD_SETTLEMENT_PANEL = false;
			$scope.$parent.SHOW_BUILD_ROAD_PANEL = true;
		}
	}

	$scope.buildRoad = function (corner1, corner2) {

	}
}]);