
// Manages the purchase of developement cards

angular.module('expeditionApp')
.controller('DevCardController', ['$scope','GameService', function ($scope, GameService, MapService) {
	
	$scope.buyDevCard = function() {
		var activePlayer = GameService.activePlayer;
		var cost = {'wool': 1, 'grain': 1, 'ore': 1};
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
				GameService.setGameState('MONOPOLYCARD');
				break;
			case 'harvest':
				GameService.setGameState('HARVESTCARD');
				break;
			default:
				alert('(Error): invalid dev. card');

		}
		ap.removeDevCard(devCard);
		GameService.canPlayDevCard = false;
	};
	/* ------------------------------- Monopoly --------------------------------- */

	// This function is called after the player uses his/her monopoly card.
	// The resourceType is the type that all other players must give up to 
	// the active player.
	$scope.monopoly = function (resourceType) {
		var allPlayers = GameService.getAllPlayers();
		for (var i = 0; i < allPlayers.length; i++) {
			if (GameService.activePlayer.color !== allPlayers[i].color) {
				var count = allPlayers[i].getResources()[resourceType];
				console.log(allPlayers[i] + " just lost " + count + " " + resourceType);
				GameService.activePlayer.incrementResource(resourceType, count);
				allPlayers[i].decrementResources(resourceType, count);
			}
		}
		GameService.setGameState('NORMAL');
	};

	/* --------------------------- Harvest (Year of Plenty) ------------------------- */
	$scope.harvestSelection = [];
	$scope.harvestSelect = function (type) {
		$scope.harvestSelection.push(type);
	};

	$scope.selectedTwoForHarvest = function () {
		return $scope.harvestSelection.length == 2;
	};
	$scope.harvest = function () {
		var ap = GameService.activePlayer;
		for (var i = 0; i < $scope.harvestSelection.length; i++) {
			ap.incrementResource($scope.harvestSelection[i], 1);
		}
	};

}]);