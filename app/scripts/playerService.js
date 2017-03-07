/**
 * Created by johnlu on 3/4/17.
 */
angular.module('expeditionApp')
.service('PlayerService', function() {
	this.createPlayer = function (playerColor) {
		var newPlayer = {};
		newPlayer.playerNumber = 0;
		newPlayer.landsOwned = {};
		newPlayer.hand = [];
		newPlayer.victoryPoints = 2;
		newPlayer.color = playerColor;
		return newPlayer;
	}

	// Define Player Prototype somehwere please.
});