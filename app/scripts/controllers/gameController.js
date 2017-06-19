/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$rootScope', '$scope', 'GameService',
    function ($rootScope, $scope, GameService) {

    $rootScope.landtypes = ['wool', 'lumber', 'ore', 'grain', 'brick'];
    $scope.game = GameService;
    // ---------------------------- Initialize Scope --------------------------------
    // State information
    $scope.activePlayer = null;
    $scope.players = null;
    $scope.lastLandSelected = {type: "boo"};
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
    
    /* ============================= Observer Registration ========================== */
    // Listen for changes in the lastLandSelected
    // GameService.registerLastLandSelectedObserver(this);
    // this.updateLastLandSelected = function (land) {
    //     $scope.lastLandSelected = land;
    // };
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

    /* =============================== Game Creation ================================ */
    // Initialize Game with 2 players. Will generate lands
    GameService.createRandomGame(1);  // ** needs modification **

    // Add players to Game
    GameService.addPlayers(['red', 'blue']);

    // Set active player to red
    GameService.setActivePlayer(0);

    // Set game state to INITAL STATE - which is the state for picking the initial
    // 2 settlements and roads.
    GameService.setGameState('INITIAL');

    $scope.players = GameService.getAllPlayers();
    $scope.landWithRobber = GameService.landWithRobber;

    // Display instruction to first player to place a settlement
    $('#placeSettlementModal').modal('show');

    /* ================================== Game Flow  ================================== */
    $scope.rollDice = function () {
        $scope.showMainControls = true;

        // Generate integer in range [2, 12].
        var die1 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var die2 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var rollResult = 7; // die1 + die2;
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

    $scope.setActivePlayer = function(num) {
        $scope.activePlayer = GameService.turnsOrder[num];
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

.controller('RobberController', ['$scope', 'GameService', function($scope, GameService) {

    $scope.playerDiscarding = null;
    $scope.discardBuffer = new discardBuffer();
    $scope.count = 0;

    $scope.$watch('discardBuffer', function (newVal, oldVal) {
        updateCount();
    }, true);

    var queue = [];
    var allPlayers = GameService.getAllPlayers();
    $scope.prepareForDiscard = function () {
        for (var i = 0; i < allPlayers.length; i++) {
            var player = allPlayers[i];
            var numRes = player.getNumResources();
            if (numRes > 7) {
                player.numCardsToDiscard = (numRes - 7);  // Create property
                player.numResources = numRes;  // To make visible to Modal
                queue.push(player);
            }
        }

        // Present first player's discard modal if queue is not empty
        if (queue.length > 0) {
            $scope.playerDiscarding = queue.shift();
            $('#discardModal').modal('show');
        } 
    }

    $scope.discard = function () {
        // Decrement resources
        var buf = $scope.discardBuffer;
        var player = $scope.playerDiscarding;
        
        player.decrementResource('wool', buf.wool);
        player.decrementResource('lumber', buf.lumber);
        player.decrementResource('grain', buf.grain);
        player.decrementResource('ore', buf.ore);
        player.decrementResource('brick', buf.brick);

        if (queue.length > 0) {
            // Present next player's discard modal
            $scope.playerDiscarding = queue.shift();
            $('#discardModal').modal('show');
        } else {
            $('#discardModal').modal('hide');
            $('#placeRobberModal').modal('show');
        }

        // provide clean buffer for next player
        $scope.discardBuffer = new discardBuffer();
    };

    function updateCount () {
        var count = 0;
        for (var type in $scope.discardBuffer) {
            if ($scope.discardBuffer.hasOwnProperty(type)) {
                count += $scope.discardBuffer[type];
            }
        }
        $scope.count = count;
    };

    function discardBuffer () {
        this.wool = 0;
        this.lumber = 0;
        this.grain = 0;
        this.ore = 0;
        this.brick = 0;
    };

}])
;