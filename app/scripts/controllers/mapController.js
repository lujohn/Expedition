// Handles all map interactions

angular.module('expeditionApp')
.controller('MapController', ['$scope','GameService', function ($scope, GameService, MapService) {

	// Assign coordinates to lands.
    GameService.initializeMap(GameService.landsMatrix);

	$scope.landsArray = GameService.landsMatrix;
    $scope.landsDictionary = GameService.landsDictionary;

	$scope.selectedLandWithID = function (landID) {
        var landSelected = $scope.landsDictionary[landID];

        if (GameService.STATE === 0) {
        	// Show build-sett menu only if build road is not already showing
        	if (!$scope.$parent.showBuildRoad) {
        		$scope.showBuildSettlementMenu(true);
        	}
        }
        // ** Update Game Service State **

        $scope.$parent.lastLandSelected = landSelected;
    };   
}]);