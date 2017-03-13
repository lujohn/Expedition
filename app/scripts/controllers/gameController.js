/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService', 'MapService', 
    function ($scope, GameService, MapService) {

    // Initialize Game with 2 players. Will generate lands
    GameService.createRandomGame(3);

    // Add players to Game
    GameService.addPlayers(['red', 'blue', 'yellow']);

    // Set the active Player;
    $scope.activePlayer = GameService.turnsOrder[0];

    // Set game state to INITAL STATE - which is the state for picking the initial
    // 2 settlements and roads.
    GameService.STATE = 0;


    // Initialize Scope
    $scope.showStartButton = false;
    $scope.SHOW_BUILD_SETTLEMENT_PANEL = false;
    $scope.SHOW_BUILD_ROAD_PANEL = false;
    $scope.SHOW_PLAYER_PANEL = false;
    $scope.SHOW_DEVELOPEMENT_PANEL = false;

    /* ------------------------- Player Action Handlers ---------------------------- */


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