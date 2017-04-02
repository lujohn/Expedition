angular.module('expeditionApp')
.controller('BuildController', ['$scope', 'LANDHEX', 'GameService', function ($scope, LANDHEX, GameService) {

	/* BUILDING COSTS:
		Settlement -> 1 wool, 1 grain, 1 brick, 1 lumber
		City -> 3 ores, 2 grain
		road -> 1 brick, 1 lumber
		dev. card -> 1 wool, 1 grain, 1 ore
	*/

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

			// Draw settlement
			drawSettlement(coordOfCorner);

		} else if (GameService.STATE === 1) {
			// Check if player has enough resources.
			var resAvailable = activePlayer.getResources();
			console.log("Resources available: " + "brick: " + resAvailable['brick'] + " wool: " + resAvailable['wool'] + " lumber: " + resAvailable['lumber'] + " grain: " + resAvailable['grain']);
			if (resAvailable['wool'] > 0 && resAvailable['grain'] > 0 && resAvailable['brick'] > 0 && resAvailable['lumber'] > 0) {
				resAvailable['wool']--; 
				resAvailable['grain']--; 
				resAvailable['brick']--; 
				resAvailable['lumber']--;

				// Draw settlement
				drawSettlement(coordOfCorner);

			} else {
				alert("Not enough resources for new settlement");
			}
		}
	}

	$scope.buildRoad = function (edgeLabel) {

		// edgeLabel will be a string of the form 'char-char'. Ex: A-B
		var corners = edgeLabel.split('-');

		// Grab activePlayer and last land clicked.
		var activePlayer = GameService.activePlayer;
		var landToBuildOn = $scope.lastLandSelected;

		// Create new road
		var coord1 = landToBuildOn.coordinates[corners[0]];
		var coord2 = landToBuildOn.coordinates[corners[1]];

		// Check if location is legal to build a road on.
		if (!edgeIsAvailable(activePlayer.color, coord1, coord2)) {
			return;
		}

		if (GameService.STATE === 0 ) {

			// Add the road to the player and the map
			var newRoad = GameService.addRoad(activePlayer.color, coord1, coord2);

			// Store in buffer
			myBuf[activePlayer.color].roads.push(newRoad);

			// Draw road 
			drawRoad(coord1, coord2, edgeLabel);
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
			// Check if player has enough resources.
			var resAvailable = activePlayer.getResources();
			console.log("Resources available: " + "brick: " + resAvailable['brick'] + " wool: " + resAvailable['wool'] + " lumber: " + resAvailable['lumber'] + " grain: " + resAvailable['grain']);
			if (resAvailable['brick'] > 0 && resAvailable['lumber'] > 0) {
				
				// Decrement resources
				resAvailable['brick']--; 
				resAvailable['lumber']--;

				// Add the road to the player and the map
				var newRoad = GameService.addRoad(activePlayer.color, coord1, coord2);

				// Draw road 
				drawRoad(coord1, coord2, edgeLabel);
				
			} else {
				alert("Not enough resources for new road");
			}
		}
	}

	function cornerIsAvailable (cornerCoord) {
		if (GameService.buildingExists(cornerCoord) || GameService.getAdjacentBuildings(cornerCoord).length !== 0) {
			return false;
		}
		return true;
	}

	// This function checks if the edge is available for building a road. Roads can only be built 
	// if there is not already an existing road AND only if it borders another road of the same
	// color or a building of the same color is on either of the road verticies.
	function edgeIsAvailable (color, from, to) {

		if (GameService.roadExists(from, to)) {
			alert("road already exists!");
			return false;
		}

		// Find an existing building on "from" or "to"
		if (GameService.buildingExists(from) || GameService.buildingExists(to)) {
			return true;
		}

		// Find a bordering road
		var borderFrom = GameService.getRoadsWithSource(from);
		var borderTo = GameService.getRoadsWithSource(to);

		if (borderFrom.includes(color) || borderTo.includes(color)) {
			return true;
		}

		// Illegal to build the road at this location
		alert("cannot build road here!");
		return false;

	}

	// This function draws a new road -- ** NOTE: move drawing code to directive **
	function drawRoad (coord1, coord2, edgeLabel) {

		var road = document.createElement('canvas');
		var x1 = coord1[0]; var y1 = coord1[1]; var x2 = coord2[0]; var y2= coord2[1];

		road.style.zIndex = "2";

		var rdCtx = road.getContext('2d');

		// Positioning road canvas depends on which side of the hex the road is being built upon.
		if (edgeLabel === "A-B" || edgeLabel === "D-E") {
			road.width = LANDHEX.WIDTH / 2;
			road.height = LANDHEX.HEIGHT / 4;
			if (edgeLabel === "A-B") {
				road.style.left = x1 + 'px';
				road.style.top = y1 + 'px';
			} else {   // D-E
				road.style.left = x2 + 'px';
				road.style.top = y2 + 'px';
			}
			strokeRoad(rdCtx, GameService.activePlayer.color, 0, 0, road.width, road.height);

		} else if (edgeLabel === "B-C" || edgeLabel === "E-F") {
			// Vertical edge
			road.width = LANDHEX.WIDTH / 10;
			road.height = LANDHEX.HEIGHT / 2;

			var xOffset = road.width / 2;
			if (edgeLabel === "B-C") {
				road.style.left = x1 - xOffset + 'px';
				road.style.top = y1 + 'px';
			} else {  // "E-F"
				road.style.left = x2 - xOffset + 'px';
				road.style.top = y2 + 'px';
			}
			strokeRoad(rdCtx, GameService.activePlayer.color, xOffset, 0, xOffset, road.height);

		} else {   // "C-D" || "F-A"
			road.width = LANDHEX.WIDTH / 2;
			road.height = LANDHEX.HEIGHT / 4;

			var xOffset = road.width;  // Shift top-left corner of canvas element to the left
			if (edgeLabel === "C-D") {
				road.style.left = x1 - xOffset + 'px';
				road.style.top = y1 + 'px';
			} else {  // "F-A"
				road.style.left = x2 - xOffset + 'px';
				road.style.top = y2 + 'px';
			}
			strokeRoad(rdCtx, GameService.activePlayer.color, 0, road.height, road.width, 0);
		}
		document.getElementById("gameBoardContainer").appendChild(road);
	}

	// This function draws a new Settlement -- ** NOTE: move drawing code to directive **
	function drawSettlement(coordOfCorner) {
		var gameContainer = document.getElementById("gameBoardContainer");
		var settlementImage = document.createElement("img");
		settlementImage.src = "images/" + GameService.activePlayer.color + "Settlement.png";
		settlementImage.width = 40;
		settlementImage.height = 40;
		settlementImage.style.left = coordOfCorner[0] - (settlementImage.width / 2) + 'px';
		settlementImage.style.top = coordOfCorner[1] - (settlementImage.height / 2) + 'px';

		gameContainer.appendChild(settlementImage);
	}

	function strokeRoad (rdCtx, color, x1, y1, x2, y2) {
			// Set styles
			// Create Path
			rdCtx.beginPath();
			rdCtx.strokeStyle = color;
			rdCtx.lineWidth = 10.0;

			rdCtx.moveTo(x1, y1);
			rdCtx.lineTo(x2, y2);
			rdCtx.stroke();
			rdCtx.closePath();
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