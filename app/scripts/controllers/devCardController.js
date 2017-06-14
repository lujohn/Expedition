
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
		if (!GameService.activePlayer.hasDevCard(devCard) && GameService.canPlayDevCard) {
			alert('Cannot play a' + ' "' + devCard + '"' + ' right now.');
			return;
		}

		switch (devCard) {
			case 'knight':
				console.log('knight');

				break;
			case 'vp':
				console.log('vp');
				break;
			case 'roads':
				console.log('roads');
				break;
			case 'monopoly':
				console.log('monopoly');
				break;
			case 'harvest':
				console.log('harvest');
				break;
			default:
				console.log('invalid dev. card');
		}


	}

}]);