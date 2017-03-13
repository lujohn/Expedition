/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService', 'MapService', 
    function ($scope, GameService, MapService) {

    // Initialize Game with 2 players. Will generate lands
    GameService.createRandomGame(2);

    // Add players to Game
    GameService.addPlayers(['red', 'blue']);

    // Set game state to INITAL STATE - which is the state for picking the initial
    // 2 settlements and roads.
    GameService.STATE = 0;

    // Set active player to red
    GameService.setActivePlayer(0);


    // Initialize Scope
    $scope.activePlayer = null;
    $scope.activeControlPanel = 0;
    $scope.lastLandSelected = null;

    // Update activePlayer whenever it changes in GameService
    $scope.$watch('GameService.activePlayer', function () {
        $scope.activePlayer = GameService.activePlayer;
    });

    $scope.setActivePanel = function (num) {
        $scope.activeControlPanel = num;
    }

    $scope.isActivePanel = function(num) {
        return $scope.activeControlPanel === num;
    }

    $scope.setActivePlayer = function(num) {
        $scope.activePlayer = GameService.turnsOrder[num];
    }

    $scope.setGameState = function(num) {
        if (num === 0) {
            // INITIAL STATE
            GameService.STATE = num;
        } else if (num === 1) {
            // ACTIVE STATE
            console.log("changing game state to 1! So Exciting");

        }
    }

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