angular.module('expeditionApp')
.directive('tradePort', ['GameService', function (GameService) {
	
	/*** Move Trading Harbor implementation to this file ***/
	game = GameService;

	return {
		restrict: 'E',
		scope: {},
		link: function (scope, element, attr) {
			
		}
	};

}]);