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

 	// For distributing resources in initialization phase (Game State 0)
 	myBuf = {};

	$scope.lastSettlementSelected = { coordOfCorner: null, img: null};
	$scope.enableBuildCityButton = false;

	$scope.setEnableBuildCityButton = function (bool) {
		$scope.enableBuildCityButton = bool;
	}

	$scope.setLastSettlementSelected = function (coordOfCorner, img) {
		$scope.lastSettlementSelected.coordOfCorner = coordOfCorner;
		$scope.lastSettlementSelected.img = img;
	}

 	// initialize myBuf
 	for (var i = 0; i < turnsOrder.length; i++) {
 		var playerColor = turnsOrder[i];
 		myBuf[playerColor] = { settlements: [], roads: [] };
 	}

 	// =========================== buildSettlement function =========================
	$scope.buildSettlement = function (corner) {
		if (!GameService.canBuildSettlement) {
			alert("Cannot build settlement at this time...");
			return;
		}

		// Get the active player
		var activePlayer = GameService.activePlayer;

		// Get information about land to add land to map graph
		var landToBuildOn = GameService.lastLandSelected;
		var coordOfCorner = landToBuildOn.coordinates[corner];


		// Check if corner is legal to build on. Only corners that are not
		// adjacent to any other existing building can be built on
		if (!cornerIsAvailable(activePlayer.color, coordOfCorner)) {
			alert("Corner not available! Pick another!");
			return;
		}

		// ------------------------ Game STATE: INITIAL ---------------------------
		if (GameService.getGameState() === 'INITIAL') {

			// Add settlement
		    var newSettlement = GameService.addBuilding(activePlayer.color, coordOfCorner);
		    
			// Store player's settlement selection in buffer
			myBuf[activePlayer.color].settlements.push(newSettlement);

			// Prompt player to build a road
			//$scope.showBuildSettlementMenu(false);
			//$scope.showBuildRoadMenu(true);

			GameService.canBuildSettlement = false;
			GameService.canBuildRoad = true;

			$('#placeRoadModal').modal('show');

			// Draw settlement
			drawSettlement(coordOfCorner);
		} 
		// ------------------------ Game STATE: NORMAL ---------------------------
		else if (GameService.getGameState() === 'NORMAL') {
			// Check if player has enough resources.
			var resAvailable = activePlayer.getResources();
			if (resAvailable['wool'] > 0 && resAvailable['grain'] > 0 && resAvailable['brick'] > 0 && resAvailable['lumber'] > 0) {
				activePlayer.decrementResource('wool', 1);
				activePlayer.decrementResource('grain', 1);
				activePlayer.decrementResource('brick', 1);
				activePlayer.decrementResource('lumber', 1);

				// Add settlement
				GameService.addBuilding(activePlayer.color, coordOfCorner);

				// Draw settlement
				drawSettlement(coordOfCorner);

			} else {
				alert("Not enough resources for new settlement!");
			}
		}
	}

	// =========================== buildRoad function =========================
	$scope.buildRoad = function (edgeLabel) {
		if (!GameService.canBuildRoad) {
			alert("Cannot build road at this time...");
			return; 
		}

		// edgeLabel will be a string of the form 'char-char'. Ex: A-B
		var corners = edgeLabel.split('-');

		// Grab activePlayer and last land clicked.
		var activePlayer = GameService.activePlayer;
		var landToBuildOn = GameService.lastLandSelected;

		// Create new road
		var coord1 = landToBuildOn.coordinates[corners[0]];
		var coord2 = landToBuildOn.coordinates[corners[1]];

		// Check if location is legal to build a road on.
		if (!edgeIsAvailable(activePlayer.color, coord1, coord2)) {
			alert("ILLEGAL to build road there");
			return;
		}

		// ------------------------ Game STATE: 0 ---------------------------
		if (GameService.getGameState() === 'INITIAL' ) {
			// add the road to the player and the map
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
					// Allocate Starting Resources to players. Players begin with the 1 resources per land
					// bordering his/her second settlment.
					distributeStartingResources();

					// End INITIAL State
					GameService.setGameState('PREP_TO_START');
					return;
					
				} else {
					turnsIndex--;
				}
			}
			GameService.setActivePlayer(turnsIndex);

			GameService.canBuildSettlement = true;
			GameService.canBuildRoad = false;

			$scope.showBuildSettlementMenu(true);
			$('#placeSettlementModal').modal('show');
			return ;
		} 

		// ------------------------ Game STATE: NORMAL ---------------------------
		if (GameService.getGameState() === 'NORMAL') {
			// Check if player has enough resources.
			var resAvailable = activePlayer.getResources();
			if (resAvailable['brick'] > 0 && resAvailable['lumber'] > 0) {
				
				// Decrement resources
				resAvailable['brick']--; 
				resAvailable['lumber']--;

				// Add the road to the player and the map
				var newRoad = GameService.addRoad(activePlayer.color, coord1, coord2);

				// Draw road 
				drawRoad(coord1, coord2, edgeLabel);
				
			} else {
				alert("Not enough resources for new road!");
			}
		} 
		// ------------------------ Game STATE: 'ROADSCARD' ---------------------------
		else if (GameService.getGameState() === 'ROADSCARD') {
			if (GameService.bonusRoads == 0) {
				// Return to NORMAL game state
				GameService.setGameState('NORMAL');
				return;
			}
			GameService.addRoad(activePlayer.color, coord1, coord2); 
			drawRoad(coord1, coord2, edgeLabel);
			GameService.bonusRoads--;
		}
	}

	// =========================== buildCity function =========================
	$scope.buildCity = function () {
		
		var cityImg = document.createElement('img');
		var settImg = $scope.lastSettlementSelected.img;

		cityImg.src = "images/" + GameService.activePlayer.color + "City.svg";
		cityImg.width = settImg.width;
		cityImg.height = settImg.height;
		cityImg.style.left = settImg.style.left;
		cityImg.style.top = settImg.style.top;

		// Remove settlement image from board and add city image
		var gameBoard = document.getElementById('gameBoardContainer');
		gameBoard.removeChild($scope.lastSettlementSelected.img);
		gameBoard.appendChild(cityImg);

		// modify player state
		GameService.addCity(GameService.activePlayer.color, $scope.lastSettlementSelected.coordOfCorner);
	}

	// This function checks if the corner is available for building a settlement. In all 
	// Game States, settlements cannot be built on occupied corners, or adjacent to any corner
	// with an existing settlement.
	//
	// Additional Restrictions:
	// Game State NORMAL: Settlements can be built only on corners that are reachable by at least one
	// of the player's roads. 
	function cornerIsAvailable (color, cornerCoord) {
		if (GameService.buildingExists(cornerCoord) || GameService.getAdjacentBuildings(cornerCoord).length !== 0) {
			return false;
		}
		if (GameService.getGameState() === 'NORMAL') {
			// Find a bordering road. getRoadsWithSource() returns an array of colors
			// representing which players have a road that connects to the passed in corner
			var roadsForCorner = GameService.getRoadsWithSource(cornerCoord);
			if (!roadsForCorner.includes(color)) {
				alert("can't build settlement there because no roads are bordering");
				return false;
			}
		}

		return true;
	}

	// This function checks if the edge is available for building a road. Roads can only be built 
	// if there is not already an existing road AND only if it borders another road of the same
	// color or a building of the same color is on either of the road verticies.
	function edgeIsAvailable (color, from, to) {

		if (!GameService.roadExists(from, to)) {
			
			// Find an existing building on "from" or "to" that is the proper color
			if ( (GameService.buildingExists(from) && GameService.getBuildingColor(from) === color) 
				|| GameService.buildingExists(to) && GameService.getBuildingColor(to) === color) {
				return true;
			}

			// Find a bordering road. getRoadsWithSource() returns an array of colors
			// representing which players have a road that connects to the passed in corner
			var borderFrom = GameService.getRoadsWithSource(from);
			var borderTo = GameService.getRoadsWithSource(to);

			if (borderFrom.includes(color) || borderTo.includes(color)) {
				return true;
			}
		}

		return false;
	}

	// This function draws a new road -- 
	// ** NOTE: move drawing code to directive **
	function drawRoad (coord1, coord2, edgeLabel) {

		var road = document.createElement('canvas');
		var x1 = coord1[0]; var y1 = coord1[1]; var x2 = coord2[0]; var y2 = coord2[1];

		// road z-index must be set lower than settlements (which is set at 101)
		road.style.zIndex = '100';

		// Get the context for drawing new road.
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
		settlementImage.src = "images/" + GameService.activePlayer.color + "Settlement.svg";
		settlementImage.width = 40;
		settlementImage.height = 40;
		settlementImage.style.position = 'absolute';
		settlementImage.style.zIndex = '101';
		settlementImage.style.left = coordOfCorner[0] - (settlementImage.width / 2) + 'px';
		settlementImage.style.top = coordOfCorner[1] - (settlementImage.height / 2) + 'px';
		settlementImage.corner = coordOfCorner;
		settlementImage.color = GameService.activePlayer.color;

		// If user clicks on settlement, give user the option to build a city if user
		// has sufficient resources. 
		settlementImage.addEventListener('click', function (e) {
			var resAvail = GameService.activePlayer.getResources();
			if (resAvail.ore >= 3 && resAvail.grain >= 2 && GameService.activePlayer.color === this.color) {
				$scope.$apply($scope.setEnableBuildCityButton(true));
			} else {
				$scope.$apply($scope.setEnableBuildCityButton(false));
			}
			$('#buildCityModal').modal('show');

			$scope.$apply($scope.setLastSettlementSelected(this.corner, settlementImage));
		});
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
			var playerColor = turnsOrder[i];
			var myBufEntry = myBuf[playerColor];
			var secondSettlement = myBufEntry.settlements[1];

			// Allocate to each player, the resouces corresponding to the lands of his/her second settlement
			GameService.getPlayerByColor(playerColor).incrementResourcesForBuilding(secondSettlement, 1);
		}
	}
}]);