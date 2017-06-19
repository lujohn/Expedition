angular.module('expeditionApp')
.directive('gameBoard', function () {
	return {
		//require: '^landsArray',
		restrict: 'E',
		templateUrl: 'views/gameBoard.html'
	};
});