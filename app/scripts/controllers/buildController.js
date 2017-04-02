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

		// Check if corner is legal to build on. Only corners that are not
		// adjacent to any other existing building can be built on
		if (!cornerIsAvailable(coordOfCorner)) {
			alert("Corner not available! Pick another!");
			return;
		}

		// Get the active player
		var activePlayer = GameService.activePlayer;

		// This will add the building to the player and the map
		var newSettlement = GameService.addBuilding(activePlayer.color, coordOfCorner);

		if (GameService.STATE === 0) {
			// Switch to BUILD_ROAD_PANEL
			$scope.setActivePanel(2); 

			// Store player's settlement selection in buffer
			myBuf[activePlayer.color].settlements.push(newSettlement);
		}

		// Draw new Settlment -- ** NOTE: move drawing code to directive **
		var gameContainer = document.getElementById("gameBoardContainer");
		var settlementImage = document.createElement("img");
		settlementImage.src = "images/" + activePlayer.color + "Settlement.png";
		settlementImage.width = 40;
		settlementImage.height = 40;
		settlementImage.style.left = coordOfCorner[0] - (settlementImage.width / 2) + 'px';
		settlementImage.style.top = coordOfCorner[1] - (settlementImage.height / 2) + 'px';

		gameContainer.appendChild(settlementImage);
	}

	function cornerIsAvailable (cornerCoord) {
		if (GameService.buildingExists(cornerCoord) || GameService.getAdjacentBuildings(cornerCoord).length !== 0) {
			return false;
		}
		return true;
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
			// Players are selecting initial resources state
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
			// Active game play state

		}

		// Draw new road -- ** NOTE: move drawing code to directive **
		var road = document.createElement('canvas');
		road.style.left = coord1[0] + 'px';
		road.style.top = coord1[1] + 'px';
		road.style.zIndex = "2";

		var ctx = road.getContext('2d');
		var roadImg = new Image();   // Create new img element
		roadImg.onload = function() {
	    	ctx.drawImage(roadImg, 0, 0);
		}
		roadImg.src = "images/redRoad.svg";
		ctx.rotate(60 * Math.PI / 180);
		document.getElementById("gameBoardContainer").appendChild(road);
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