describe('Test GameService', function () {
	
	beforeEach(module('expeditionApp'));

	var GameService, PlayerService;

	beforeEach(inject(function(_GameService_, _PlayerService_) {
		GameService = _GameService_;
		PlayerService = _PlayerService_;
	}));

	describe('test gameWon function', function () {

		it('should be game won by red', function () {
			var newPlayer = GameService.addPlayer("red");  // Add "red"

			newPlayer.victoryPoints = 9;
			expect(GameService.gameWon()).toBeFalsy();
		});

		it('should be game won by blue', function () {
			var newPlayer = GameService.addPlayer("blue");  // Add "blue"

			// Blue should win!
			newPlayer.victoryPoints = 10;
			expect(GameService.gameWon()).toBeTruthy;
		});

	}); 

	describe('test endTurn function', function () {

		it("should go from red's turn to blue's turn", function (){
			var player0 = GameService.addPlayer("red");
			var player1 = GameService.addPlayer("blue");
			var player2 = GameService.addPlayer("yellow");
			var player3 = GameService.addPlayer("white");

			expect(GameService.getNumPlayers()).toBe(4);
			expect(GameService.activePlayer.color).toBe("red");

			GameService.endTurn();
			expect(GameService.activePlayer.color).toBe("blue");

			GameService.endTurn();
			expect(GameService.activePlayer.color).toBe("yellow");

			GameService.endTurn();
			expect(GameService.activePlayer.color).toBe("white");

			GameService.endTurn();
			expect(GameService.activePlayer.color).toBe("red");
		});
	});

	describe('test addPlayer and getPlayer functions', function () {

		it('should add player WHITE', function () {
			GameService.addPlayer("WHITE");
			expect(GameService.getNumPlayers()).toBe(1);

			expect(GameService.getPlayer("WHITE").color).toBe("WHITE");
		});

		it('should add 3 players from array', function () {
			GameService.addPlayers(["R", "B", "G"]);
			expect(GameService.getNumPlayers()).toBe(3);
		});
	});

});