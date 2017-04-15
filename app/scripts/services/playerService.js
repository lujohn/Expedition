
angular.module('expeditionApp')
.service('PlayerService', function() {

	this.createPlayer = function (playerColor) {
		var newPlayer = {};
		newPlayer.color = playerColor;

		// This object keeps track of the number of each resource the player has in hand
		newPlayer.resourcesInHand = {
			"wool": 0,
			"ore": 0,
			"brick": 0,
			"lumber": 0,
			"grain": 0
		};

		newPlayer.victoryPoints = 0;
		newPlayer.buildingsOwned = [];
		newPlayer.roadsOwned = [];

		// This function increments the player's resources after a dice roll
		newPlayer.diceRolled = function (diceResult) {

			// Go through all of the players' buildings
			for (var i = 0; i < this.buildingsOwned.length; i++) {
				var building = this.buildingsOwned[i];
				var landsOfBuilding = building.lands;
				for (var j = 0; j < landsOfBuilding.length; j++) {
					// Only increment resource if there isn't a robber on the land
					var land = landsOfBuilding[j];
					if (land.diceNumber === diceResult && !land.hasRobber) {
						if (building.type === "settlement") {
							this.incrementResource(land.type, 1);
						} else if (building.type === "city") {
							this.incrementResource(land.type, 2);
							console.log("double " + land.type + " for city!");
						}
					}
				}

			}
		};

		/*------------------------ player building functions ------------------------- */
		newPlayer.addRoad = function (road) {
			if (this.color != road.color) {
				return false;
			} else {
				this.roadsOwned.push(road);
				return true;
			}
		};

		newPlayer.addBuilding = function (building) {
			this.buildingsOwned.push(building);
			this.victoryPoints++;
		};

		newPlayer.addCity = function (coord) {
			var builds = this.buildingsOwned;
			for (var i = 0; i < builds.length; i++) {
				var build = builds[i];
				var buildLoc = build.location;
				if (buildLoc[0] === coord[0] && buildLoc[1] === coord[1]) {
					build.type = "city";
					this.victoryPoints++;
					break;
				}
			}
		}

		/*------------------------ player resource functions ------------------------- */
		newPlayer.getResources = function () {
			return this.resourcesInHand;
		};

		newPlayer.getNumResources = function () {
			var count = 0;
			for (var type in this.resourcesInHand) {
				if (this.resourcesInHand.hasOwnProperty(type)) {
					count += this.resourcesInHand[type];
				}
			}
			console.log(count);
			return count;
		};

		newPlayer.incrementResource = function (type, amount) {
			this.resourcesInHand[type] += amount;
		};

		newPlayer.decrementResource = function (type, amount) {
			this.resourcesInHand[type] -= amount;
		};

		newPlayer.incrementResourcesForBuilding = function (building) {
			for (var i = 0; i < building.lands.length; i++) {
				this.incrementResource(building.lands[i].type, 1);
			}
		};

		newPlayer.hasSufficientResources = function (resourceObj) {
			var resAvail = this.getResources();
	        for (var type in resourceObj) {
	            if (resourceObj.hasOwnProperty(type)) {
	                if (resAvail[type] < resourceObj[type]) {
	                    return false;
	                }
	            }
	        }
	        return true;
		};

		newPlayer.toString = function () {
			return this.color;
		};
		
		return newPlayer;
	};
});