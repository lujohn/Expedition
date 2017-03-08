/**
 * Created by johnlu on 3/3/17.
 */

 /* The GameService is a STATE MACHINE that represents the current state of
    the game */

angular.module('expeditionApp')
.service('GameService', ['LandFactory', 'PlayerService', function (LandFactory, PlayerService) {

    /* ------------------------ For Testing ------------------------------ */
    const LAND_TYPES = ["sheep", "ore", "brick", "wood", "wheat"];
    this.NUM_HEXES_IN_ROW = [3, 4, 5, 4, 3];  // Helps with populating game map

    /* ============================== State Information ============================== */
    this.landsMatrix = [[],[],[],[],[]];   // Stores the lands in play for this game
    this.landsDictionary = {}   // Stores lands for later lookup

    this.turnsArray = []  // Array of player colors indicating turn order. Can reimplment with circular linked list
    this.playersDictionary = {};  // Player information as key, value pair <Color, PlayerObject>
    this.activePlayer = PlayerService.createPlayer("red");

    /* ============================ Land-related functions ============================= */
    this.getActivePlayer = function() {
        return this.activePlayer;
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

    // For Testing Only 
    this.assignLandDiceNumbersRandom = function () {
        var possibleNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
        for (var i = 0; i < possibleNumbers.length; i++) {
            this.landsDictionary["land" + i].diceNumber = possibleNumbers[i];
        }
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

    // This function ends the active players turn by setting the active player property 
    // to the next player indicated in the turnsArray field.
    this.endTurn = function () {
        var curPlayerIndex = this.turnsArray.indexOf(this.activePlayer.color);
        if (curPlayerIndex === this.turnsArray.length - 1) {
            this.activePlayer = this.playersDictionary[this.turnsArray[0]];
        } else {
            this.activePlayer = this.playersDictionary[this.turnsArray[curPlayerIndex + 1]];
        }
    }

    // Take an array of players (color strings) and adds them into the game
    this.addPlayers = function (colorsArray) {
        for (var i = 0; i < colorsArray.length; i++) {
            this.addPlayer(colorsArray[i]);
        }
        // colorsArray.forEach( function (playerColor) {
        //     this.addPlayer(playerColor);
        // });
    }

    this.addPlayer = function (playerColor) {
        // Do not allow duplicate colors. One player per color
        if (this.turnsArray.includes(playerColor)) {
            throw 'Tried to add multiple players of same color!';
        }

        var newPlayer = PlayerService.createPlayer(playerColor);

        // Store new player's color in turnsArray
        this.turnsArray.push(newPlayer.color);

        // Store new player in dictionary.
        this.playersDictionary[playerColor] = newPlayer;

        console.log("Player Created: " + newPlayer);
        return newPlayer;
    }

    this.getPlayer = function (playerColor) {
        return this.playersDictionary[playerColor];
    }

    this.getNumPlayers = function () {
        return this.turnsArray.length;
    }

}]);