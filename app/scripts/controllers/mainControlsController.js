angular.module('expeditionApp')
.controller('MainControlsController', ['$scope', function ($scope) {


	$scope.showBuildSettlement = function () {
		console.log("showBuildSettlement called");
		$scope.$parent.SHOW_BUILD_SETTLEMENT_PANEL = !$scope.$parent.SHOW_BUILD_SETTLEMENT_PANEL;  // inherited scope property from GameController
	}

	$scope.showBuildRoad = function () {
		$scope.$parent.SHOW_BUILD_ROAD_PANEL = !$scope.$parent.SHOW_BUILD_ROAD_PANEL;  // inherited scope property from GameController
	}

	$scope.showPlayerInfo = function () {
		console.log("showInfo called (from MainControlsController");
		$scope.$parent.SHOW_PLAYER_PANEL = !$scope.$parent.SHOW_PLAYER_PANEL;
	}

	$scope.showDevCard = function () {
		console.log("developementCard button clicked (from MainControlsController");
		$scope.$parent.SHOW_DEVELOPEMENT_PANEL = !$scope.$parent.SHOW_DEVELOPEMENT_PANEL;
	}
}]);