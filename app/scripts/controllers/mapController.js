angular.module('expeditionApp')
.controller('MapController', ['$scope','GameService', 'MapService', function ($scope, GameService, MapService) {
	// Handles all map interactions

	$scope.landsArray = GameService.landsMatrix;
    $scope.landsDictionary = GameService.landsDictionary;

	$scope.selectedLandWithID = function (landID) {
        console.log(landID + "selected (from MapController)");
        var landSelected = $scope.landsDictionary[landID];

        // Update Game Service State
        GameService.lastLandSelected = landSelected;
    }   
}]);