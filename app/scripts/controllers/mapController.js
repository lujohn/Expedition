// Handles all map interactions

angular.module('expeditionApp')
.controller('MapController', ['$scope','GameService', 'MapService', function ($scope, GameService, MapService) {

	// Assign coordinates to lands. This function must be called before using MapService.
    //MapService.initializeGraph(GameService.landsMatrix);

    // Make the lands available for drawing purposes. See 'landDirective.js'
	$scope.landsArray = GameService.landsMatrix;
    $scope.landsDictionary = GameService.landsDictionary;

    // Update the lastLandSelected (defined in GameController)
	$scope.selectedLandWithID = function (landID) {
        var landSelected = $scope.landsDictionary[landID];

        GameService.setLastLandSelected(landSelected);
        //$scope.$parent.lastLandSelected = landSelected;
    };   
}]);