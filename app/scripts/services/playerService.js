
angular.module('expeditionApp')
.service('PlayerService', function() {

	this.createPlayer = function (playerColor) {
		var newPlayer = {};
		newPlayer.color = playerColor;

		// This object keeps track of the number of each resource the player has in hand
		newPlayer.resourcesInHand = { "wool": 1, "ore": 0, "brick": 0, "lumber": 0, "grain": 0 };

		newPlayer.victoryPoints = 0;
		newPlayer.buildingsOwned = [];
		newPlayer.roadsOwned = [];

		// Keeps track of the trading harbors owned.
		newPlayer.harborsOwned = [];
		// Default exchange rate with bank is 4 of the same type for 1 of any type. Owning harbors
		// gives the player better exchange rates
		newPlayer.bankExchangeRates = { wool: 4, lumber: 4, grain: 4, ore: 4, brick: 4 };

		// This buffer keeps track of all developement cards purchased in player's current turn. 
		// Player must wait a turn before these can be played.
		newPlayer.newDevCardsBuffer = [];
		// The counts of unplayed developement cards. These cards are not also in the newDevCardsBuffer.
		newPlayer.devCards = { "knight": 0, "vp": 0, "roads": 0, "monopoly": 0, "harvest": 0 };
		// The number of vp cards showing
		newPlayer.vpCardsShowing = 0;
		// The number of knight cards showing
		newPlayer.knightsShowing = 0;

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

		newPlayer.addHarbor = function (harborType) {
			console.log("adding harbor: " + harborType + " to " + this.color);
			var exchangeRates = this.bankExchangeRates;
			if (harborType === "three-to-one") {
				angular.forEach(exchangeRates, function (rate, type) {
					if (rate > 3) {
						exchangeRates[type] = 3;
					} 
				});
			} else {
				exchangeRates[harborType] = 2;
				console.log("new rate: " + exchangeRates[harborType]);
			}
			this.harborsOwned.push(harborType);
		}

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

		/*----------------------- developement card functions ------------------------ */
		newPlayer.addDevCard = function(devCard) {
			this.newDevCardsBuffer.push(devCard);
		}

		newPlayer.hasDevCard = function(devCard) {
			return this.devCards[devCard] > 0;
		}

		newPlayer.removeDevCard = function (devCard) {
			if (this.devCards[devCard] > 0) {
				this.devCards[devCard]--;
				return true;
			}
			return false;
		}

		// This function should be called at the beginning of player's turn to move all
		// development cards purchased the previous turn to the player's playable collection
		// of dev. cards.
		newPlayer.flushDevCardsBuffer = function () {
			while (this.newDevCardsBuffer.length > 0) {
				this.devCards[this.newDevCardsBuffer.pop()]++;
			}
		}

		newPlayer.revealVPCard = function () {
			this.vpCardsShowing++;
			this.victoryPoints++;
		}

		newPlayer.revealKnightCard = function () {
			this.knightsShowing++;
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
			return count;
		};

		newPlayer.incrementResource = function (type, amount) {
			this.resourcesInHand[type] += amount;
		};

		newPlayer.decrementResource = function (type, amount) {
			this.resourcesInHand[type] -= amount;
		};

		newPlayer.decrementResources = function(resourceObj) {
			for (var type in resourceObj) {
				if (resourceObj.hasOwnProperty(type)) {
					this.resourcesInHand[type] -= resourceObj[type];
				}
			}
		}

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
		
		return newPlayer;
	};
});