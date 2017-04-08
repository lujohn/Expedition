/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService',
    function ($scope, GameService) {

    // Initialize Scope
    $scope.activePlayer = null;
    $scope.players = null;
    $scope.lastLandSelected = null;
    $scope.showMainControls = false;


    $scope.landWithRobber = "";

    // ** Debugging **
    $scope.showBuildSettlement = true;
    $scope.showBuildRoad = true;
    $scope.showRollDice = true;
    $scope.showEndTurn = true;
    $scope.showMoveRobber = true;


    var activeMenus = new Set();
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
            $scope.showMainControls = false;
        }
    };

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

    $scope.players = GameService.getAllPlayers();

    $scope.landWithRobber = GameService.landWithRobber;

    /* ================================ Display Panels =============================== */
    $scope.setActivePanel = function (num) {
        $scope.activeControlPanel = num;
    };

    $scope.isActivePanel = function(num) {
        return $scope.activeControlPanel === num;
    };

    $scope.setActivePlayer = function(num) {
        $scope.activePlayer = GameService.turnsOrder[num];
    };
    /* ================================== Game Flow  ================================== */
    $scope.rollDice = function () {
        $scope.showMainControls = true;

        // Generate integer in [2, 12].
        var die1 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var die2 = Math.floor(Math.random() * 6) + 1;  // [1, 6]
        var rollResult = die1 + die2;

        alert("you rolled: " + rollResult);

        GameService.diceRolled(rollResult);
    };

    $scope.endTurn = function () {
        // Check for victory
        if (GameService.gameWon()) {
            alert("Congrats " + GameService.activePlayer.color + "! You won!");

            // Do something
        } else {
            GameService.endTurn();
        }
    };

    $scope.placeRobber = function () {
        $('#robberModal').modal('show');
        var oldRobberLand = GameService.landWithRobber;
        oldRobberLand.hasRobber = false;

        var newRobberLand = $scope.lastLandSelected;
        newRobberLand.hasRobber = true;

        GameService.landWithRobber = newRobberLand;
        $scope.landWithRobber = newRobberLand;
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

.controller('TradeController', ['$scope', 'GameService', function ($scope, GameService) {

    $scope.tradeRequest = {
        tradePartner: "",
        offer: { wool: 0, lumber: 0, grain: 0, ore: 0, brick: 0},
        demand: { wool: 0, lumber: 0, grain: 0, ore: 0, brick: 0}
    };

    $scope.submitTradeRequest = function () {

        // present trade modal to other party
        $('#tradeAcceptModal').modal('show');
    };

    $scope.acceptTrade = function () {

        // Get the player and check if he/she has sufficient resources
        var tradePartner = GameService.getPlayerByColor($scope.tradeRequest.tradePartner);
        var offer = $scope.tradeRequest.offer;
        var demand = $scope.tradeRequest.demand;

        // Vertify that tradePartner has enough resources to accept
        var tpResources = tradePartner.getResources();
        for (var type in demand) {
            if (demand.hasOwnProperty(type)) {
                if (tpResources[type] < demand[type]) {
                    alert("Not enough " + type + " resources for this trade!");
                } 
            }
        }

        // tradePartner has adequate resources for trade. Execute trade.
        executeTrade($scope.activePlayer, tradePartner, offer, demand);
    };

    function executeTrade(player1, player2, offer, demand) {

        var player1Res = player1.getResources();
        var player2Res = player2.getResources();

        for (var type in offer) {
            if (offer.hasOwnProperty(type)) {
                // Decrement each type by specified amount in player1 and increment in player2
                player1Res[type] -= offer[type];
                player1Res[type] += demand[type];

                player2Res[type] -= demand[type];
                player2Res[type] += offer[type];
            }
        }
    }

    $scope.rejectTrade = function () {
        console.log("Rejected Trade!");
    };
}])
;