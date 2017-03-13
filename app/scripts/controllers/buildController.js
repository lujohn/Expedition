angular.module('expeditionApp')
.controller('BuildController', ['$scope', 'BuildingFactory', 'MapService', 'GameService',
 function ($scope, BuildingFactory, MapService, GameService) {

 	var turnsOrder = GameService.turnsOrder;
 	var reverseOrder = false;
 	var turnsIndex = 0;
 	myBuf = {};

 	// initialize myBuf
 	for (var i = 0; i < turnsOrder.length; i++) {
 		console.log(turnsOrder.length);
 		var player = turnsOrder[i];
 		myBuf[player.color] = { settlements: [], roads: [] };
 		console.log("myBuf for " + player.color + myBuf[player.color].settlements);
 	}


	$scope.presentBuildSettlementMenu = function ( ){
		// implement
	}

	$scope.buildSettlement = function (corner) {

		// Get information about land to add land to map graph
		var landToBuildOn = $scope.lastLandSelected;   // Inherited from MapController
		var coordOfCorner = landToBuildOn.coordinates[corner];

		// Get the active player
		var activePlayer = GameService.activePlayer;  // Inherited from MapController

		// Create a Settlement
		var newSettlement = BuildingFactory.createBuilding(activePlayer.color, coordOfCorner);

		// Add to map
		MapService.addBuildingToGraph(newSettlement);

		if (GameService.STATE === 0) {
			$scope.setActivePanel(2);  // Switch to BUILD_ROAD_PANEL

			// Store player's settlement selection in myBuf
			myBuf[activePlayer.color].settlements.push(newSettlement);
			console.log("myBuf for ('red')  settles: " + myBuf['red'].settlements + " roads: " + myBuf['red'].roads);

			// Add settlement to player
			activePlayer.addBuilding(newSettlement);
		}
	}

	$scope.buildRoad = function (edgeString) {

		// edgeString will be a string of the form 'char-char'. Ex: A-B
		var corners = edgeString.split('-');

		// Grab activePlayer and last land clicked.
		var activePlayer = GameService.activePlayer;
		var landToBuildOn = $scope.lastLandSelected;

		// Create new road
		var vertex1 = landToBuildOn.coordinates[corners[0]];
		var vertex2 = landToBuildOn.coordinates[corners[1]];
		var newRoad = BuildingFactory.createRoad(activePlayer.color, vertex1, vertex2);
		console.log("adding new road " + newRoad.toString());
		// Add road to map
		MapService.addRoadToGraph(newRoad);
		myBuf[activePlayer.color].roads.push(newRoad);

		if (GameService.STATE === 0 ) {
			console.log("turnsIndex: " + turnsIndex);
			// Store player's road selection in myBuf.
			console.log("myBuf for ('red')  settles: " + myBuf['red'].settlements + " roads: " + myBuf['red'].roads);

			// Add road to player
			activePlayer.addRoad(newRoad);

			if (!reverseOrder) {
				if (turnsIndex === turnsOrder.length -1) {
					// no need to change index
					reverseOrder = true;
				} else   {
					turnsIndex++;
				}
			} else {
				if (turnsIndex === 0) {
					$scope.setGameState(1); // If every player has 2 roads and 2 settlements, end INITIAL STATE

					// Allocate Starting Resources to players --> players begin with the 1 resources per land
					// bordering his/her second settlment.
					distributeStartingResources();

				} else {
					turnsIndex--;
				}
			}
			GameService.setActivePlayer(turnsIndex);
			$scope.setActivePanel(1);
		}
	}

	function distributeStartingResources () {

		console.log("myBuf for ('red'): " + myBuf['red'].settlements);
		console.log('turnsIndex: ' + turnsIndex);
		console.log(turnsOrder[turnsIndex].toString());

		for (var i = 0; i < turnsOrder.length; i++) {
			var player = turnsOrder[i];
			var myBufEntry = myBuf[player.color];
			var secondSettlement = myBufEntry.settlements[1];
			console.log("secondSettlement location: " + secondSettlement.location);

			// Allocate to each player, the resouces corresponding to the lands of his/her second settlement
			var landsForBuilding = MapService.getLandsForBuilding(secondSettlement);
			console.log("Lands for Second Settlement of " + player.color + " are: " + landsForBuilding);
		}
	}
}]);