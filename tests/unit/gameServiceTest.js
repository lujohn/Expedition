describe('Test GameService', function () {
	
	beforeEach(module('expeditionApp'));

	var GameService, PlayerService;

	beforeEach(inject(function(_GameService_, _PlayerService_) {
		GameService = _GameService_;
		PlayerService = _PlayerService_;
	}));

	describe('test gameWon function', function () {

		it('should be game won by red', function () {
			var newPlayer = GameService.addPlayer(0);  // Add "Red"
			expect(GameService.players.length).toBe(1);

			newPlayer.victoryPoints = 9;
			expect(GameService.gameWon()).toBeFalsy();
		});

		it('should be game won by blue', function () {
			var newPlayer = GameService.addPlayer(1);  // Add "Blue"
			expect(GameService.players.length).toBe(1);

			// Blue should win!
			newPlayer.victoryPoints = 10;
			expect(GameService.gameWon()).toBeTruthy;
		});

	}); 

	describe('test endTurn function', function () {
		it("should go from red's turn to blue's turn", function (){
			var player0 = GameService.addPlayer(0);
			var player1 = GameService.addPlayer(1);
			var player2 = GameService.addPlayer(2);
			var player3 = GameService.addPlayer(3);

			expect(GameService.getNumPlayers()).toBe(4);
		});
	});

	describe('test addPlayer function', function () {

	});


});