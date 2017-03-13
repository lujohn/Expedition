// Handles all map interactions

angular.module('expeditionApp')
.controller('MapController', ['$scope','GameService', 'MapService', function ($scope, GameService, MapService) {

	// Assign coordinates to lands.
    MapService.initializeGraph(GameService.landsMatrix);
    console.log("Number of Verticies: " + MapService.getNumVerticies());

	$scope.landsArray = GameService.landsMatrix;
    $scope.landsDictionary = GameService.landsDictionary;

	$scope.selectedLandWithID = function (landID) {
        console.log(landID + "selected (from MapController)");
        var landSelected = $scope.landsDictionary[landID];

        // Update Game Service State
        $scope.$parent.lastLandSelected = landSelected;

        $scope.$parent.activeControlPanel = 1;
    }   
}]);