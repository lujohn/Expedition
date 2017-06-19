angular.module('expeditionApp')
.directive('tradePort', ['GameService', function (GameService) {
	
	game = GameService;

	return {
		restrict: 'E',
		scope: {},
		link: function (scope, element, attr) {
			
		}
	};

}]);