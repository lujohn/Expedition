/**
 * Created by johnlu on 3/4/17.
 */
angular.module('expeditionApp')
.service('PlayerService', function() {
	const PLAYER_COLORS = ["red", "blue", "yellow", "white"];
	this.createPlayer = function (num) {
		var newPlayer = {};
		newPlayer.playerNumber = 0;
		newPlayer.landsOwned = {};
		newPlayer.hand = [];
		newPlayer.victoryPoints = 2;
		newPlayer.color = PLAYER_COLORS[num];

		return newPlayer;
	}

	// Define Player Prototype somehwere please.
});