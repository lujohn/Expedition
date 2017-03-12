angular.module('expeditionApp')
.controller('MainControlsController', ['$scope', 'GameService', function ($scope, GameService) {


	$scope.showBuildMenu = function () {
		console.log("build called (from MainControlsController");

		$scope.$parent.SHOW_BUILD_PANEL = !$scope.$parent.SHOW_BUILD_PANEL;  // inherited scope property from GameController
	}

	$scope.showPlayerInfo = function () {
		console.log("showInfo called (from MainControlsController");
		$scope.$parent.SHOW_PLAYER_PANEL = !$scope.$parent.SHOW_PLAYER_PANEL;
	}

	$scope.showDevCardMenu = function () {
		console.log("developementCard button clicked (from MainControlsController");
		$scope.$parent.SHOW_DEVELOPEMENT_PANEL = !$scope.$parent.SHOW_DEVELOPEMENT_PANEL;
	}
}]);