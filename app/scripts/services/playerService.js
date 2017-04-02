
angular.module('expeditionApp')
.service('PlayerService', function() {
	this.createPlayer = function (playerColor) {
		var newPlayer = {};
		newPlayer.color = playerColor;
		// This object keeps track of which resources the player controls for each diceNumber
		// Note: duplicates must be allowed here.
		newPlayer.resourcesForDiceNumber = { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
		// This object keeps track of the number of each resource the player has in hand
		newPlayer.resourcesInHand = {
			"wool": 0,
			"ore": 0,
			"brick": 0,
			"lumber": 0,
			"grain": 0
		};
		newPlayer.victoryPoints = 2;

		newPlayer.buildingsOwned = [];  // (key, value) => (location : Coordinates, building : building)
		newPlayer.roadsOwned = [];

		/*------------------- player function definitions --------------------- */
		// Insert a land into the player's collection of owned lands
		newPlayer.addLand = function (land) {
			this.landsForDiceNumber[land.diceNumber].push(land);
		}

		newPlayer.addRoad = function (road) {
			if (this.color != road.color) {
				return false;
			} else {
				this.roadsOwned.push(road);
				return true;
			}
		}

		newPlayer.addBuilding = function (building) {
			this.buildingsOwned.push(building);
			
			// Associate each of the buildings' lands with a dice number for easier distributing
			// of resources later.
			var lands = building.lands;
			for (var i = 0; i < lands.length; i++) {
				var land = lands[i];
				if (land.type !== "desert") {
					this.resourcesForDiceNumber[land.diceNumber].push(land.type);
				}
			}
		}

		newPlayer.incrementResource = function (type) {
			this.resourcesInHand[type]++;
		}

		newPlayer.incrementResourcesForBuilding = function (building) {
			for (var i = 0; i < building.lands.length; i++) {
				this.incrementResource(building.lands[i].type);
			}
		}

		newPlayer.diceRolled = function (diceResult) {
			var resourcesEarned = this.resourcesForDiceNumber[diceResult];
			for (var i = 0; i < resourcesEarned.length; i++) {
				this.incrementResource(resourcesEarned[i]);
			}
		}


		newPlayer.toString = function () {
			return this.color;
		}
		return newPlayer;
	}
});