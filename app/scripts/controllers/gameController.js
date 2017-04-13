/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService',
    function ($scope, GameService) {

    // ---------------------------- Initialize Scope --------------------------------
    // State information
    $scope.activePlayer = null;
    $scope.players = null;
    $scope.lastLandSelected = null;
    $scope.isPlacingRobber = false;
    $scope.landWithRobber = "";

    // Control Menus
    $scope.showMainControls = false;
    $scope.showBuildSettlement = false;
    $scope.showBuildRoad = false;
    $scope.showPlayerInfo = false;

    // Control Buttons
    $scope.showRollDice = false;
    $scope.showEndTurn = false;
    
    /* ============================= Observer Registration ========================== */
    // Listen for changes in the active player
    GameService.registerActivePlayerObserver(this);
    this.updateActivePlayer = function (activePlayer) {
        $scope.activePlayer = activePlayer;
    };

    // Listen for change in Game State
    GameService.registerGameStateObserver(this);
    this.gameStateChanged = function (newState) {
        if (newState === 1) {
            GameService.setActivePlayer(0);
            showBeginTurnModal();
        }
    };

    /* =============================== Game Creation ================================ */
    // Initialize Game with 2 players. Will generate lands
    GameService.createRandomGame(1);  // ** needs modification **

    // Add players to Game
    GameService.addPlayers(['red', 'blue']);

    // Set active player to red
    GameService.setActivePlayer(0);

    // Set game state to INITAL STATE - which is the state for picking the initial
    // 2 settlements and roads.
    GameService.setGameState(0);

    $scope.players = GameService.getAllPlayers();
    $scope.landWithRobber = GameService.landWithRobber;

    // Display instruction to first player to place a settlement
    $('#placeSettlementModal').modal('show');

    function showBeginTurnModal() {
        hideAllControlMenus(); 
        hideAllControlButtons();

        $scope.showPlayerInfo = true;
        $('#beginTurnModal').modal('show');
    }

    /* ================================ Displaying Menus =============================== */
    $scope.showBuildSettlementMenu = function (bool) {
        $scope.showBuildSettlement = bool;
    };   
    
    $scope.showBuildRoadMenu = function (bool) {
        $scope.showBuildRoad = bool;
    };

    $scope.showMainControlsMenu = function (bool) {
        $scope.showMainControls = bool;
    };

    $scope.setActivePlayer = function(num) {
        $scope.activePlayer = GameService.turnsOrder[num];
    };

    function hideAllControlMenus() {
        // Control Menus
        $scope.showMainControls = false;
        $scope.showBuildSettlement = false;
        $scope.showBuildRoad = false;
        $scope.showPlayerInfo = false;
    };

    function hideAllControlButtons() {
        // Control Buttons
        $scope.showEndTurn = false;
    };
    /* ================================== Game Flow  ================================== */
    $scope.rollDice = function () {
        $scope.showMainControls = true;

        // Generate integer in [2, 12].
        var die1 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var die2 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var rollResult = die1 + die2;

        alert("you rolled: " + rollResult);
        if (rollResult === 7) {
            hideAllControlMenus();
            hideAllControlButtons();
            $scope.isPlacingRobber = true;
            $('#robberModal').modal('show');
        } else {
            GameService.diceRolled(rollResult);
        }
    };

    $scope.endTurn = function () {
        // Check for victory
        if (GameService.gameWon()) {
            alert("Congrats " + GameService.activePlayer.color + "! You won!");

            // Do something
        } else {
            GameService.endTurn();
            showBeginTurnModal();
        }
    };

    $scope.placeRobber = function () {
        var oldRobberLand = GameService.landWithRobber;
        oldRobberLand.hasRobber = false;

        var newRobberLand = $scope.lastLandSelected;
        newRobberLand.hasRobber = true;

        GameService.landWithRobber = newRobberLand;
        $scope.landWithRobber = newRobberLand;

        // Once robber has been placed, display the main controls
        $scope.isPlacingRobber = false;
        $scope.showMainControls = true;
    };
						
}])

.controller('MainControlsController', ['$scope', function ($scope) {

    $scope.toggleBuildSettlementMenu = function () {
        console.log("toggleShowBuildSettlement called");
        /*$scope.setActivePanel(1); */ // inherited scope property from GameController
        $scope.$parent.showBuildSettlement = !$scope.showBuildSettlement;
    };

    $scope.toggleBuildRoadMenu = function () {
        //$scope.setActivePanel(2);  // inherited scope property from GameController
        $scope.$parent.showBuildRoad = !$scope.showBuildRoad;
    };

}])

;