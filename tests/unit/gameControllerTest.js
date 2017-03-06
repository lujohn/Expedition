describe('Controller: GameController', function () {
	beforeEach(module('expeditionApp'));

	var $controller, gameService, scope, GameController;

	beforeEach(inject(function(_$controller_, GameService) {
		$controller = _$controller_;
		gameService = GameService;

		scope = {};
		GameController = $controller('GameController', {$scope: scope, GameService: gameService});
	}));
	describe('test initial state of GameController', function () {
		it('asserts scope.activePlayer to be red', function () {
			expect(scope.activePlayer.color).toBe("red");
		});
	});

	describe('test player action functions', function () {
		it('test endTurn() - should change scope.activePlayer to blue, yellow, white, then red', function() {
			scope.endTurn();
			expect(scope.activePlayer.color).toBe("blue");
			scope.endTurn();
			expect(scope.activePlayer.color).toBe("yellow");
			scope.endTurn();
			expect(scope.activePlayer.color).toBe("white");
			scope.endTurn();
			expect(scope.activePlayer.color).toBe("red");
		});
	});
})