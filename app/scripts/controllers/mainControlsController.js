angular.module('expeditionApp')
.controller('MainControlsController', ['$scope', function ($scope) {


	$scope.showBuildSettlement = function () {
		console.log("showBuildSettlement called");
		$scope.setActivePanel(1);  // inherited scope property from GameController
	}

	$scope.showBuildRoad = function () {
		$scope.setActivePanel(2);  // inherited scope property from GameController
	}

	$scope.showPlayerInfo = function () {
		console.log("showInfo called (from MainControlsController");
		$scope.setActivePanel(3);
	}

	$scope.showDevCard = function () {
		console.log("developementCard button clicked (from MainControlsController");
		$scope.setActivePanel(4);
	}
}]);