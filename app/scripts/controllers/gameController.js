/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$rootScope', '$scope', 'GameService', function ($rootScope, $scope, GameService) {

    $rootScope.landtypes = ['wool', 'lumber', 'ore', 'grain', 'brick'];
    $scope.game = GameService;
    // ---------------------------- Initialize Scope --------------------------------
    // State information
    $scope.activePlayer = null;
    $scope.players = null;
    $scope.lastLandSelected = null;
    $scope.landWithRobber = null;
    $scope.rollResult = null;

    // For Special Events
    $scope.isPlacingRobber = false;

    // Control Menus
    $scope.showMainControls = true;
    $scope.showBuildSettlement = true;
    $scope.showBuildRoad = true;
    $scope.showPlayerInfo = true;

    // Control Buttons
    $scope.showRollDice = false;
    $scope.showEndTurn = false;
    

    $scope.players = GameService.getAllPlayers();
    $scope.landWithRobber = GameService.landWithRobber;
    $scope.activePlayer = GameService.activePlayer;

    // Display instruction to first player to place a settlement
    $('#placeSettlementModal').modal('show');

    $scope.setActivePlayer = function(num) {
        console.log("GameController.setActivePlayer() called!");
        $scope.activePlayer = GameService.turnsOrder[num];
    };

    /* ================================== Game Flow  ================================== */
    $scope.rollDice = function () {
        $scope.showMainControls = true;

        // Generate integer in range [2, 12].
        var die1 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var die2 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var rollResult = die1 + die2;
        $scope.rollResult = rollResult;
        if (rollResult === 7) {
            // Players with more than 7 cards must discard half (rounding down)
            GameService.setGameState('ROBBER');
        } else {
            GameService.diceRolled(rollResult);
            $('#rollResultModal').modal('show');
        }
    };

    $scope.endTurn = function () {

        if (GameService.STATE === 'INITIAL') {
            alert("Cannot end turn during INITIAL phase!");
            return;
        }

        // Check for victory
        if (GameService.gameWon()) {
            alert("Congrats " + GameService.activePlayer.color + "! You won!");
        } else {
            GameService.endTurn();
            $('#beginTurnModal').modal('show');
        }
    };

    $scope.placeRobber = function () {

        // Remove robber from old position
        var oldRobberLand = GameService.landWithRobber;
        oldRobberLand.hasRobber = false;

        // Put robber on new position
        var newRobberLand = GameService.lastLandSelected;
        newRobberLand.hasRobber = true;
        GameService.landWithRobber = $scope.landWithRobber = newRobberLand;

        $scope.isPlacingRobber = false;
        GameService.setGameState('NORMAL');
    };	

    /* ============================= Observer Registration ========================== */
    $scope.$watch(function () { return GameService.lastLandSelected }, function (land) {
        $scope.lastLandSelected = land;
    });

    // Listen for changes in the active player
    GameService.registerActivePlayerObserver(this);
    this.updateActivePlayer = function (activePlayer) {
        $scope.activePlayer = activePlayer;
    };

    // Listen for change in Game State
    GameService.registerGameStateObserver(this);
    this.gameStateChanged = function (newState) {
        console.log('Game State changed to ' + newState);
        if (newState === 'PREP_TO_START') {

            GameService.setActivePlayer(0);
            $scope.showPlayerInfo = true;
            $('#beginTurnModal').modal('show');

            // Begin Game!!
            GameService.setGameState('NORMAL');

        } else if (newState === 'NORMAL') {

            GameService.canBuildSettlement = true;
            GameService.canBuildRoad = true;
            GameService.canEndTurn = true;

        } else if (newState === 'ROBBER') {

            GameService.canBuildRoad = false;
            GameService.canEndTurn = false;
            GameService.canBuildSettlement = false;
            $('#robberInfoModal').modal('show');

            // This will show the 'place robber' button
            $scope.isPlacingRobber = true;

            // Hide the building menus
            $scope.showBuildRoadMenu(false);
            $scope.showBuildSettlementMenu(false);

        } else if (newState === 'ROADSCARD') {

            // Player get's 2 free roads.
            $('#roadsCardUsedModal').modal('show');
            GameService.bonusRoads = 2;
            // Restrict player's actions until both bonus roads are placed.
            GameService.canBuildSettlement = false;
            GameService.canEndTurn = false;

        } else if (newState === 'MONOPOLYCARD') {

            $('#monopolyCardUsedModal').modal('show');

        } else if (newState === 'HARVESTCARD') {

            // User picks two resources from bank
            $('#harvestCardUsedModal').modal('show');
        }
    };

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

    function hideAllControlMenus() {
        // Control Menus
        $scope.showMainControls = false;
        $scope.showBuildSettlement = false;
        $scope.showBuildRoad = false;
    };

    function hideAllControlButtons() {
        // Control Buttons
        $scope.showEndTurn = false;
    };				
}])



.controller('MainControlsController', ['$scope', function ($scope) {

    $scope.toggleBuildSettlementMenu = function () {
        $scope.$parent.showBuildSettlement = !$scope.showBuildSettlement;
    };

    $scope.toggleBuildRoadMenu = function () {
        $scope.$parent.showBuildRoad = !$scope.showBuildRoad;
    };

}])
;
