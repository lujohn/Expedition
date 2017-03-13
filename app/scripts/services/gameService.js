/**
 * Created by johnlu on 3/3/17.
 */

 /* The GameService is a STATE MACHINE that represents the current state of
    the game */

angular.module('expeditionApp')
.service('GameService', ['LandFactory', 'PlayerService', function (LandFactory, PlayerService) {

    var LAND_TYPES = ["sheep", "ore", "brick", "wood", "wheat"];
    this.NUM_HEXES_IN_ROW = [3, 4, 5, 4, 3];  // Helps with populating game map

    this.landsMatrix = [[],[],[],[],[]];   // Stores the lands in play for this game
    this.landsDictionary = {}   // Stores lands for later lookup
    this.playersDictionary = {};  // Player information as key, value pair <Color, PlayerObject>
    this.turnsOrder = []  // Array of player colors indicating turn order.

    this.STATE = -1;
    this.activePlayer = null;

    this.setActivePlayer = function (num) {
        this.activePlayer = this.turnsOrder[num];
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
                var rand = Math.floor(Math.random() * LAND_TYPES.length);
                var landType = LAND_TYPES[rand];

                // Use Land Factory to create a land
                var newLand = LandFactory.createLand(landType);
                newLand.landID = "land" + count.toString();

                // Store new land
                this.landsMatrix[row].push(newLand);
                this.landsDictionary[newLand.landID] = newLand; 
            }
        }
    }

    this.assignLandDiceNumbersRandom = function () {
        var possibleNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

        // Shuffle
        for (var i = 0; i < possibleNumbers.length; i++){
            var randIndex = Math.floor(Math.random() * possibleNumbers.length);
            temp = possibleNumbers[randIndex];
            possibleNumbers[randIndex] = possibleNumbers[i];
            possibleNumbers[i] = temp;
        }

        // Assign
        for (var i = 0; i < possibleNumbers.length; i++) {
            this.landsDictionary["land" + i].diceNumber = possibleNumbers[i];
        }
    }

    this.getLandWithID = function (landID) {
        return this.landsDictionary[landID];
    }

    /* ============================ Player-related functions ============================= */
    // Checks if the game has been won. The game is over when any player's "victoryPoints" 
    // is 10 or above. 
    this.gameWon = function () {
        for (var i = 0; i < this.turnsArray.length; i++) {
            if (this.playersDictionary[this.turnsArray[i]].victoryPoints >= 10) {
                return true;
            }
        }
        return false;
    }

    // Take an array of players (color strings) and adds them into the game
    this.addPlayers = function (colorsArray) {
        for (var i = 0; i < colorsArray.length; i++) {
            this.addPlayer(colorsArray[i]);
        }
    }

    this.addPlayer = function (playerColor) {
        var newPlayer = PlayerService.createPlayer(playerColor);
        this.turnsOrder.push(newPlayer); 
        this.playersDictionary[playerColor] = newPlayer;

        return newPlayer;
    }

    this.getPlayerByColor = function (playerColor) {
        return this.playersDictionary[playerColor];
    }

    this.getNumPlayers = function () {
        return this.turnsArray.length;
    }

}]);