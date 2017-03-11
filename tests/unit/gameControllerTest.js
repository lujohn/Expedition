describe('Controller: GameController', function () {
	beforeEach(module('expeditionApp'));

	var $controller, gameService, scope, GameController;

	beforeEach(inject(function(_$controller_, GameService) {
		$controller = _$controller_;
		gameService = GameService;

		scope = {};
		GameController = $controller('GameController', {$scope: scope, GameService: gameService});
	}));

})