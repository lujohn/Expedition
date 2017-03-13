
angular.module('expeditionApp')
.service('PlayerService', function() {
	this.createPlayer = function (playerColor) {
		var newPlayer = {};
		newPlayer.color = playerColor;
		// This object keeps track of which resources the player controls for each diceNumber
		// Note: duplicates must be allowed here.
		newPlayer.landsForDiceNumber = { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
		// This object keeps track of the number of each resource the player has in hand
		newPlayer.resourcesInHand = {
			"sheep": 0,
			"ore": 0,
			"brick": 0,
			"wood": 0,
			"wheat": 0
		};
		newPlayer.victoryPoints = 2;

		// !!!Create Service for These !!!
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

			// Be sure to decrease resource
		}

		newPlayer.addResource = function (type) {
			this.resourcesInHand[type]++;
		}

		// This function is called after the dice has been rolled. It goes through
		// all of the lands owned by this player and adds to the resources the 
		// player currently holds.
		newPlayer.diceRolled = function (numberRolled) {
			var lands = this.landsForDiceNumber[numberRolled];
			for (var i = 0; i < lands.length; i++) {
				var land = lands[i];
				// increment the player's resources
				this.resourcesInHand[land.type]++;
			}
		}

		newPlayer.toString = function () {
			return this.color;
		}
		return newPlayer;
	}
});