angular.module('expeditionApp')
.directive('gameBoard', ['GameService', function (GameService) {
	_GameService = GameService;
	return {
		//require: '^^landsMatrix',
		restrict: 'E',
		controller: ['$scope', function (scope) {
			scope.landsMatrix = _GameService.landsMatrix;
		}],
		template: '<div id="gameBoardContainer"><div ng-repeat="landRow in landsMatrix"><div ng-repeat="land in landRow"><canvas land-hex data-land-type="{{land.type}}" id="{{land.landID}}"></canvas></div></div><robber data-land="landWithRobber"></robber></div>'
		/* Problem with AWS and CORS */
		//templateUrl: '/app/views/gameBoard.html'
	};
}]);