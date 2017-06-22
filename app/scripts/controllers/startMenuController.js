angular.module('expeditionApp')

.controller('StartMenuController', ['$scope', '$state', 'GameService', function ($scope, $state, GameService) {

	console.log("Hello from start menu controller");
	$('#startMenuModal').modal('show');
	$scope.nPlayers = 2;

	$scope.submitOptions = function () {
		$('#startMenuModal').modal('hide');

		// Set up the game
		f();
		GameService.createGame($scope.nPlayers);
		$state.go('play');
	};

	var f = function () {
		console.log($scope.nPlayers + " (from f())");
	}

}])
;