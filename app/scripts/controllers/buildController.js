angular.module('expeditionApp')
.controller('BuildController', ['$scope', 'GameService', function ($scope, GameService) {

 	var turnsOrder = GameService.turnsOrder;
 	var reverseOrder = false;
 	var turnsIndex = 0;
 	myBuf = {};

 	// initialize myBuf
 	for (var i = 0; i < turnsOrder.length; i++) {
 		var player = turnsOrder[i];
 		myBuf[player.color] = { settlements: [], roads: [] };
 	}

	$scope.buildSettlement = function (corner) {

		// Get information about land to add land to map graph
		var landToBuildOn = $scope.lastLandSelected;   // Inherited from MapController
		var coordOfCorner = landToBuildOn.coordinates[corner];

		// Get the active player
		var activePlayer = GameService.activePlayer;  // Inherited from MapController

		// This will add the building to the player and the map
		var newSettlement = GameService.addBuilding(activePlayer.color, coordOfCorner);

		if (GameService.STATE === 0) {
			$scope.setActivePanel(2);  // Switch to BUILD_ROAD_PANEL

			// Store player's settlement selection in myBuf
			myBuf[activePlayer.color].settlements.push(newSettlement);
		}
	}

	$scope.buildRoad = function (edgeString) {

		// edgeString will be a string of the form 'char-char'. Ex: A-B
		var corners = edgeString.split('-');

		// Grab activePlayer and last land clicked.
		var activePlayer = GameService.activePlayer;
		var landToBuildOn = $scope.lastLandSelected;

		// Create new road
		var coord1 = landToBuildOn.coordinates[corners[0]];
		var coord2 = landToBuildOn.coordinates[corners[1]];

		// This will add the road to the player and the map
		var newRoad = GameService.addRoad(activePlayer.color, coord1, coord2);

		// Store in buffer
		myBuf[activePlayer.color].roads.push(newRoad);

		if (GameService.STATE === 0 ) {
			console.log("turnsIndex: " + turnsIndex);
			// Store player's road selection in myBuf.

			if (!reverseOrder) {
				if (turnsIndex === turnsOrder.length -1) {
					// no need to change index
					reverseOrder = true;
				} else   {
					turnsIndex++;
				}
			} else {
				if (turnsIndex === 0) {
					// If every player has 2 roads and 2 settlements, end INITIAL STATE
					GameService.setGameState(1);

					// Allocate Starting Resources to players --> players begin with the 1 resources per land
					// bordering his/her second settlment.
					distributeStartingResources();
					return;
				} else {
					turnsIndex--;
				}
			}
			GameService.setActivePlayer(turnsIndex);
			// GameController's Scope. Display Build Settlement Panel - after building Road is done
			$scope.setActivePanel(1);
		} else if (GameService.STATE === 1) {
			
		}
	}

	function distributeStartingResources () {

		for (var i = 0; i < turnsOrder.length; i++) {
			var player = turnsOrder[i];
			var myBufEntry = myBuf[player.color];
			var secondSettlement = myBufEntry.settlements[1];
			console.log("secondSettlement location: " + secondSettlement.location);

			// Allocate to each player, the resouces corresponding to the lands of his/her second settlement
			console.log("Lands for Second Settlement of " + player.color + " are: " + secondSettlement.lands);
			player.incrementResourcesForBuilding(secondSettlement);
		}
	}
}]);