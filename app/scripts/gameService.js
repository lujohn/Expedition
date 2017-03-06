/**
 * Created by johnlu on 3/3/17.
 */

 /* The GameService is a state machine that represents the current state of
    the game */

angular.module('expeditionApp')
.service('GameService', ['LandFactory', 'PlayerService', function (LandFactory, PlayerService) {

    const LAND_TYPES = ["sheep", "ore", "brick", "wood", "wheat"];
    this.NUM_HEXES_IN_ROW = [3, 4, 5, 4, 3];
    this.landsMatrix = [[],[],[],[],[]];   // Stores the lands in play for this game
    this.landsDictionary = {}   // Stores lands for later lookup

    this.players = [];
    this.activePlayerNum = 0;

    this.getActivePlayer = function() {
        return this.players[this.activePlayerNum];
    }

    this.createRandomGame = function (numPlayers) {
        // Generate lands randomly for now. MODIFY
        this.generateLandsRandom();
        // Assign dice numbers to land
        this.assignLandDiceNumbersRandom();
        // Create players
    };

    this.generateLandsRandom = function () {
        // Generate Lands Randomly. Get a number randomly between 0 and 4 (inclusive)
        var count = 0;
        var numRows = this.landsMatrix.length;
        for (var row = 0; row < numRows; row++) {
            var numCols = this.NUM_HEXES_IN_ROW[row];
            for (var col = 0; col < numCols; col++, count++) {
                // Calculate a random land type
                var rand = Math.floor(Math.random() * 5);
                var landType = LAND_TYPES[rand];
                // Use Land Factory to create a land
                var newLand = LandFactory.createLand(landType);
                newLand.landID = "land" + count.toString();
                // Store new land
                this.landsMatrix[row].push(newLand);
                this.landsDictionary[newLand.landID] = newLand; 
                console.log("land generated => " + newLand);
            }
        }
    }

    this.assignLandDiceNumbersRandom = function () {
        var possibleNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
        for (var i = 0; i < possibleNumbers.length; i++) {
            this.landsDictionary["land" + i].diceNumber = possibleNumbers[i];
        }
    }

    this.gameWon = function () {
        this.players.forEach(function (player) {
            if (player.victoryPoints >= 10) {
                return true;
            }
        });
        return false; 
    }

    this.endTurn = function () {
        if (this.activePlayerNum === this.players.length - 1) {
            this.activePlayerNum = 0;
        }
        else {
            this.activePlayerNum++;
        }
    }

    this.addPlayer = function (playerNum) {
        var newPlayer = PlayerService.createPlayer(playerNum);
        this.players.push(newPlayer);
        console.log("Player Created: " + newPlayer.color);

        return newPlayer;
    }

    this.getPlayer = function (color) {

    }

    this.getNumPlayers = function () {
        return this.players.length;
    }

}]);