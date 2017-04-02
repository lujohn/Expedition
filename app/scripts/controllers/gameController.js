/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService',
    function ($scope, GameService) {

    // Initialize Scope
    $scope.activePlayer = null;
    $scope.lastLandSelected = null;
    $scope.showMainControls = false;
    $scope.showPlayerPanel = false;
    $scope.showRollDice = false;
    $scope.showEndTurn = false;

    // Control Panels:
    // -1: Show No Panel
    // 1: Building Settlment Panel - for building settlements
    // 2: Building Road Panel - build roads
    // 3: Trade
    // 4: Info
    // 5: Development Card

    // Start at 0 for INITIAL STATE
    $scope.activeControlPanel = 1;

    /* ============================= Observer Registration ========================== */
    // Listen for changes in the active player
    GameService.registerActivePlayerObserver(this);
    this.updateActivePlayer = function (activePlayer) {
        $scope.activePlayer = activePlayer;
    }

    // Listen for change in Game State
    GameService.registerGameStateObserver(this);
    this.gameStateChanged = function (newState) {
        if (newState === 1) {
            console.log("Game State changed to 1");
            GameService.setActivePlayer(0);

            // Hide all panels
            $scope.setActivePanel(-1);

            // Show player details panel
            $scope.showPlayerPanel = true;

            $scope.showMainControls = false;

            // ** DEBUGGING ** 
            $scope.showRollDice = true;
            $scope.showEndTurn = true;
        }
    }

    /* =============================== Game Creation ================================ */
    // Initialize Game with 2 players. Will generate lands
    GameService.createRandomGame(1);

    // Add players to Game
    GameService.addPlayers(['red', 'blue']);

    // Set active player to red
    GameService.setActivePlayer(0);

    // Set game state to INITAL STATE - which is the state for picking the initial
    // 2 settlements and roads.
    GameService.setGameState(0);

    /* ================================ Display Panels =============================== */
    $scope.setActivePanel = function (num) {
        console.log("active Panel set to " + num);
        $scope.activeControlPanel = num;
    }

    $scope.isActivePanel = function(num) {
        return $scope.activeControlPanel === num;
    }

    $scope.setActivePlayer = function(num) {
        $scope.activePlayer = GameService.turnsOrder[num];
    }

    /* ================================== Game Flow  ================================== */
    $scope.rollDice = function () {
        $scope.showMainControls = true;

        // Generate integer in [2, 12]. ** CHANGE IMPLEMENTATION TO ACCOUNT FOR PROBABILITY **
        var rollResult = Math.floor(Math.random() * 11) + 2;

        alert("you rolled: " + rollResult);

        GameService.diceRolled(rollResult);
    }

    $scope.endTurn = function () {
        // Check for victory
        if (GameService.gameWon()) {
            alert("Congrats " + GameService.activePlayer.color + "! You won!");

            // Do something
        } else {
            GameService.endTurn();
        }
    }

    /* --------------------------------- Helper functions ----------------------------- */
    function beginNextTurn() {
    	$scope.activePlayer = GameService.getActivePlayer();
    }									

}])