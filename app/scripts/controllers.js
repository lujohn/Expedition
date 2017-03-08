/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService', 'MapService', function($scope, GameService) {
    $scope.welcome = "Welcome from the Game Controller!";
    const PLAYER_COLORS = ["red", "blue", "yellow", "white"];
    /* =========================== For Testing Only ================================ */
    GameService.createRandomGame(4);
    GameService.addPlayers(PLAYER_COLORS);
    $scope.activePlayer = GameService.getActivePlayer();
            
    /* ------------------------- Player Action Handlers ---------------------------- */
    $scope.offerTrade = function (otherPlayerColor) {
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
    	$scope.showPlayerPanel();
    }

    $scope.showPlayerPanel = function () {
    	// Show active player's panel.
    	console.log("show player panel for " + $scope.activePlayer.color);
    }

    function beginNextTurn() {
    	$scope.activePlayer = GameService.getActivePlayer();
    }

    /* ------------------------- End of Player Action Handlers ------------------------- */																	

}])
.controller('MapController', ['$scope', 'MapService', function($scope, MapService) {
    $scope.drawGame = function () {
        MapService.drawGameBoard();
    }
}])
.controller('PlayerController', ['$scope', 'PlayerService', function($scope, PlayerService, GameService) {

}]);