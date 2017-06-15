
// Manages the purchase of developement cards

angular.module('expeditionApp')
.controller('DevCardController', ['$scope','GameService', function ($scope, GameService, MapService) {
	
	$scope.buyDevCard = function() {
		var activePlayer = GameService.activePlayer;
		var cost = {'wool': 1, 'wheat': 1, 'ore': 1};
		if (!activePlayer.hasSufficientResources(cost)) {
			alert("Not enough resources for developement card!"); 
			return;	
		} 
		activePlayer.decrementResources(cost);

		var newDevCard = GameService.drawDevCard();

		// *** Change to Modal...
		alert('(From DevCardController) You drew a ' + newDevCard + '!');

		activePlayer.addDevCard(newDevCard);
	};

	$scope.useDevCard = function(devCard) {
		$('#buyDevCardModal').modal('hide');
		$('#devCardInfoModal').modal('hide');
		$('#useDevCardModal').modal('hide');
		var ap = GameService.activePlayer;
		if (!ap.hasDevCard(devCard) && GameService.canPlayDevCard) {
			alert('Cannot play a' + ' "' + devCard + '"' + ' right now.');
			//return;
		}

		switch (devCard) {
			case 'knight':
				GameService.setGameState('ROBBER');
				ap.revealKnightCard();
				// *** Card must remain face up on the player's side (Add to player info panel) ***
				break;
			case 'vp':
				ap.revealVPCard();
				// *** Card must remain face up on the player's side ***
				break;
			case 'roads':
				GameService.setGameState('ROADSCARD');
				break;
			case 'monopoly':
				console.log('monopoly has no implementation yet!');
				break;
			case 'harvest':
				console.log('harvest has no implementation yet!');
				break;
			default:
				alert('(Error): invalid dev. card');

		}
		ap.removeDevCard(devCard);
		GameService.canPlayDevCard = false;
	}

}]);