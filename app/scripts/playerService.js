
angular.module('expeditionApp')
.service('PlayerService', function() {
	this.createPlayer = function (playerColor) {
		var newPlayer = {};
		newPlayer.color = playerColor;  // "red, white, blue ... etc"
		newPlayer.landsOwned = {};
		newPlayer.resourcesOwned = {};  // (key, value) => (landType : String, amount : int)
		newPlayer.victoryPoints = 2;

		// !!!Create Service for These !!!
		newPlayer.buildingsOwned = {};  // (key, value) => (location : Coordinates, building : building)
		newPlayer.roadsOwned = [];

		/*------------------- player function definitions --------------------- */
		// Insert a land into the player's collection of owned lands
		newPlayer.addLand = function (landID, land) {
			// Error checking should happen on client side
			if (landsOwned.hasOwnProperty(landID)) {
				throw 'Player already owns land' + landID;
			} else {
				landsOwned[landID] = land;
			}
		}

		newPlayer.addRoad = function (road) {
			newPlayer.push(road);
		}

		newPlayer.addBuilding = function (building) {
			newPlayer.buildingsOwned.push(building);
		}

		return newPlayer;
	}
});