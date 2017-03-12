/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService', 'MapService', 
    function ($scope, GameService, MapService) {

    /* =========================== For Testing Only ================================ */
    $scope.showStartButton = true;
    $scope.SHOW_BUILD_PANEL = false;
    $scope.SHOW_PLAYER_PANEL = false;
    $scope.SHOw_DEVELOPEMENT_PANEL = false;

    // TESTING WITH MOCK SETUP. USE ANGULAR FORM TO POPULATE INFO.
    $scope.start = function () {

        // Initialize Game with 2 players. Will generate lands
        GameService.createRandomGame(3);

        // Assign coordinates to lands.
        MapService.assignCoordinatesToLands(GameService.landsMatrix);

        // Add players to Game
        GameService.addPlayers(['red', 'blue', 'yellow']);

        // Set the active Player;
        $scope.activePlayer = GameService.getPlayerByColor(GameService.turnsOrder[0]);

        // Remove Start Button
        $scope.showStartButton = false;

        // Set game state to INITAL STATE - which is the state for picking the initial
        // 2 settlements and roads.
        GameService.STATE = 0;
    }

    /* --------------------------- INITIAL_STATE logic ---------------------------- */
    $scope.selectionsBuffer = {red: [], blue: [], yellow: []}
    $scope.selectedInitialSettlement = function (hexCorner) {
        var activePlayer = $scope.activePlayer;
        var land = GameService.lastLandSelected;
        console.log(activePlayer.color + " you selected a " + land.type + " corner: " + hexCorner);

        $scope.selectionsBuffer[activePlayer.color].push(land);

        $scope.activePlayer = getNextPlayer();
    }

    $scope.selectedInitialRoad = function (corner1, corner2) {
        var activePlayer = $scope.activePlayer;
    }

    $scope.toggleBuildingState = function () {
        $scope.BUILDING_STATE = !$scope.BUILDING_STATE;
    }
            
    /* ------------------------- Player Action Handlers ---------------------------- */



    $scope.offeredTrade = function (otherPlayerColor) {
    	console.log("offer trade");
    }

    // End turn button clicked
    $scope.endTurn = function () {
    	// Check if game is over
    	console.log("end turn");
    	var playerWon = GameService.gameWon();
    	if (!playerWon) {
    		GameService.endTurn();
    		beginNextTurn();
    	}
    }

    $scope.determinePlayerOrder = function () {
    	// Do dice Roll Animation? 
    	console.log("determine player order");
    }

    /* --------------------------------- Helper functions ----------------------------- */
    function getNextPlayer() {
        var idx = $scope.turnsOrder.indexOf($scope.activePlayer.color) 
        console.log("index of player is: " + idx);
        if (idx === $scope.turnsOrder.length - 1) {
            return GameService.getPlayerByColor($scope.turnsOrder[0]);
        } else {
            return GameService.getPlayerByColor($scope.turnsOrder[idx+1])
        }

    }

    function beginNextTurn() {
    	$scope.activePlayer = GameService.getActivePlayer();
    }									


}])