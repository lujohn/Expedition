/**
 * Created by johnlu on 3/3/17.
 */

 /* The GameService is a STATE MACHINE that represents the current state of
    the game */

angular.module('expeditionApp')
.service('GameService', ['LandFactory', 'PlayerService', 'MapService', 'BuildingFactory', function (LandFactory, PlayerService, MapService, BuildingFactory) {
    var LAND_CONSTRUCTION_DICTIONARY = {
        "grain": 4,
        "lumber": 4,
        "wool": 4,
        "ore": 3,
        "brick": 3,
        "desert": 1
    };

    var DEV_CARD_CONSTURCTION_DICTIONARY = {
        "knight": 14,
        "victoryPts": 5,
        "roadBuilding": 2,
        "monopoly": 2,
        "yearOfPlenty": 2
    }

    this.NUM_HEXES_IN_ROW = [3, 4, 5, 4, 3];  // Helps with populating game map
    this.landsMatrix = [[],[],[],[],[]];   // Stores the lands in play for this game
    this.landsDictionary = {}   // Stores lands for later lookup
    this.playersDictionary = {};  // Player information as key, value pair <Color, PlayerObject>
    this.turnsOrder = []  // Array of players (color only) indicating turn order.
    this.devCardsDeck = []  // Stores development cards

    /* STATES:
        INITIAL - players choose initial settlements and roads
        PREP_TO_BEGIN - Transition phase to do any necessary setup before starting.
        NORMAL - Game is in session
        ROBBER - 7 rolled or Knight card played
        TRADE - ***
        ROADSCARD - When "roads" develeopment card is played
        END GAME */

    this.STATE = "";

    this.activePlayer = null;   // Pointer to active player
    this.landWithRobber = null;  // landID that robber is on

    // These control restrict the actions of the active player. For instance, canPlayDevCard
    // is true when the player begins his/her turn and false after a card has been played during
    // the turn.
    this.canBuildSettlement = true;
    this.canBuildRoad = false;
    this.canPlayDevCard = false;

    /* ================================ Observers ================================ */
    // Observers for activePlayer change.
    var activePlayerOberservers = [];
    this.registerActivePlayerObserver = function (observer) {
        activePlayerOberservers.push(observer);
    }

    // Observers for GAME STATE change
    var gameStateObservers = [];
    this.registerGameStateObserver = function (observer) {
        gameStateObservers.push(observer);
    }

    this.setGameState = function (state) {
        this.STATE = state;

        // Notify observers that game state has changed. Mainly, used by gameController to
        // present robber modal.
        for (var i = 0; i < gameStateObservers.length; i++) {
            gameStateObservers[i].gameStateChanged(state);
        }
    }

    this.getGameState = function () {
        return this.STATE;
    }

    this.setActivePlayer = function (num) {

        // Set active player to next player
        var playerColor = this.turnsOrder[num];
        this.activePlayer = this.getPlayerByColor(playerColor);

        // Setup for new turn. 
        this.activePlayer.flushDevCardsBuffer();
        this.canPlayDevCard = true;
        
        // Notify all observers that active player has changed
        for (var i = 0; i < activePlayerOberservers.length; i++) {
            activePlayerOberservers[i].updateActivePlayer(this.activePlayer);
        }
    }

    /* ============================== Game Creation ============================== */
    this.createRandomGame = function (numPlayers) {
        // Generate lands randomly for now. MODIFY
        this.generateLandsRandom();
        // Assign dice numbers to land
        this.assignLandDiceNumbersRandom();
        // Create players

        // Generate Development Cards
        this.generateDevCards();

    };

    this.generateLandsRandom = function () {

        // Construct an array of land types.
        var arrangement = [];
        for (var prop in LAND_CONSTRUCTION_DICTIONARY) {
            if (LAND_CONSTRUCTION_DICTIONARY.hasOwnProperty(prop)) {
                var numLandsForType = LAND_CONSTRUCTION_DICTIONARY[prop];
                for (var i = 0; i < numLandsForType; i++) {
                    arrangement.push(prop);
                }
            }
        }

        // Arrange land types Randomly.
        shuffle(arrangement);

        // Create and store lands
        var idx = 0;
        var numRows = this.landsMatrix.length;
        for (var row = 0; row < numRows; row++) {
            var numCols = this.NUM_HEXES_IN_ROW[row];
            for (var col = 0; col < numCols; col++, idx++) {
                // Use Land Factory to create a land
                var newLand = LandFactory.createLand(arrangement[idx]);
                var landID = "land" + idx.toString();
                newLand.landID = landID;

                // Add the robber to the desert land
                if (arrangement[idx] === "desert") {
                    newLand.hasRobber = true;
                    this.landWithRobber = newLand;
                }

                // Store new land
                this.landsMatrix[row].push(newLand);
                this.landsDictionary[newLand.landID] = newLand; 
            }
        }
    }

    this.assignLandDiceNumbersRandom = function () {
        var possibleNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

        // Shuffle Dice Numbers
        shuffle(possibleNumbers);

        // Assign dice numbers to land 
        var idx = 0;
        for (var i = 0; i < this.landsMatrix.length; i++) {
            var numCols = this.NUM_HEXES_IN_ROW[i];
            for (var j = 0; j < numCols; j++) {
                var land = this.landsMatrix[i][j];
                if (land.type !== "desert") {
                    this.landsMatrix[i][j].diceNumber = possibleNumbers[idx++];
                } 
            }
        }
    }

    this.getLandWithID = function (landID) {
        return this.landsDictionary[landID];
    }

    /* ========================== Development cards functions ============================ */
    this.generateDevCards = function() {
        for (cardType in DEV_CARD_CONSTURCTION_DICTIONARY) {
            for (var i = 0; i < DEV_CARD_CONSTURCTION_DICTIONARY[cardType]; i++) {
                this.devCardsDeck.push(cardType);
            }
        }
        shuffle(this.devCardsDeck);
    }

    this.drawDevCard = function() {
        return this.devCardsDeck.pop();
    }

    /* ============================== Map-related functions ============================== */
    this.addRoad = function (color, from, to) {
        var newRoad = BuildingFactory.createRoad(color, from, to);
        this.playersDictionary[color].addRoad(newRoad);

        MapService.addRoadToGraph(newRoad);

        return newRoad; // return road created
    }

    this.addBuilding = function (color, coordinates) {
        var newBuilding = BuildingFactory.createBuilding(color, coordinates);
        newBuilding.lands = MapService.getLandsForCoordinates(coordinates);

        // Add building to the player
        this.playersDictionary[color].addBuilding(newBuilding);

        // Add building to the graph
        MapService.addBuildingToGraph(newBuilding);


        return newBuilding;  // return the building created
    }

    this.addCity = function (color, coordinates) {
        this.playersDictionary[color].addCity(coordinates);
    }

    this.roadExists = function (from, to) {
        return MapService.roadExistsAt(from, to);
    }

    this.buildingExists = function (coordinates) {
        return MapService.buildingExistsAt(coordinates);
    }

    this.getBuildingColor = function (coordinates) {
        return MapService.getBuildingColor(coordinates);
    }

    this.getAdjacentBuildings = function(coordinates) {
        return MapService.getAdjacentBuildings(coordinates);
    }

    this.getRoadsWithSource = function (coordinates) {
        return MapService.getRoadsWithSource(coordinates);
    }


    this.initializeMap = function (lands) {
        MapService.initializeGraph(lands);
    }

    /* ============================ Player-related functions ============================= */
    this.diceRolled = function (diceResult) {
        for (var i = 0; i < this.turnsOrder.length; i++) {
            var playerColor = this.turnsOrder[i];

            this.getPlayerByColor(playerColor).diceRolled(diceResult);
        }
    }

    this.endTurn = function () {
        // Change active player to next in line
        this.setActivePlayer(this.getNextPlayerIndex());
    }

    // This function returns the index of the next player in the turnsOrder array
    this.getNextPlayerIndex = function () {
        var idx = this.turnsOrder.indexOf(this.activePlayer.color) 
        if (idx === this.turnsOrder.length - 1) {
            return 0;
            //return this.getPlayerByColor(this.turnsOrder[0]);
        } else {
            return idx + 1;
            //return this.getPlayerByColor(this.turnsOrder[idx+1]);
        }
    }


    // Checks if the game has been won. The game is over when any player's "victoryPoints" 
    // is 10 or above. 
    this.gameWon = function () {
        for (var i = 0; i < this.turnsOrder.length; i++) {
            if (this.playersDictionary[this.turnsOrder[i]].victoryPoints >= 10) {
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
        this.turnsOrder.push(playerColor); 
        this.playersDictionary[playerColor] = newPlayer;

        return newPlayer;
    }

    this.getAllPlayers = function () {
        var allPlayers = [];
        for (var i = 0; i < this.turnsOrder.length; i++) {
            allPlayers.push(this.getPlayerByColor(this.turnsOrder[i]));
        }
        return allPlayers;
    }

    this.getPlayerByColor = function (playerColor) {
        return this.playersDictionary[playerColor];
    }

    // This function returns the player whose turn number is "num"
    this.getPlayer = function (num) {
        return this.turnsOrder[0];  
    }

    this.getNumPlayers = function () {
        return this.turnsOrder.length;
    }

    /* Helper - Shuffle function */
    function shuffle(array) {
        for (var i = 0; i < array.length; i++) {
            var randIndex = Math.floor(Math.random() * array.length);
            temp = array[randIndex];
            array[randIndex] = array[i];
            array[i] = temp;
        }
    }

}]);