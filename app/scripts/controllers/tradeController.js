angular.module('expeditionApp')
.controller('TradeController', ['$scope', 'GameService', function ($scope, GameService) {

    // -------------------------- For Bank Trades ----------------------------

    // Default exchange rate is 4 of same type for 1 of any other type
    $scope.bankExchangeRate = {
        wool: 4, lumber: 4, grain: 4, ore: 4, brick: 4
    };
    $scope.bankOfferType = "";
    $scope.bankDemandType = "";

    $scope.selectOffer = function (type) {
        $scope.bankOfferType = type;
    };

    $scope.selectDemand = function (type) {
        $scope.bankDemandType = type;
    };

    $scope.submitBankTrade = function () {
        var activePlayer = GameService.activePlayer;
        var resAvail = activePlayer.getResources();
        var offerType = $scope.bankOfferType;
        var demandType = $scope.bankDemandType;
        var rate = $scope.bankExchangeRate[offerType];

        if (resAvail[offerType] >= rate) {
            activePlayer.decrementResource(offerType, rate);
            activePlayer.incrementResource(demandType, 1);
        } else {
            $('#InsufficientResourceAlert').modal('show');
        }
    };

    // ----------------------- For Player to Player Trades -----------------------
    $scope.tradeRequest = {
        tradePartner: "",
        offer: { wool: 0, lumber: 0, grain: 0, ore: 0, brick: 0},
        demand: { wool: 0, lumber: 0, grain: 0, ore: 0, brick: 0}
    };

    $scope.submitTradeRequest = function () {
        // Check for sufficient resources
        var offer = $scope.tradeRequest.offer;
        var activePlayer = GameService.activePlayer;

        if (hasSufficientResources(activePlayer, offer)) {
            // present trade modal to other party
            $('#tradeAcceptModal').modal('show');
        } else {
            $('#InsufficientResourceAlert').modal('show');
        }
    };

    $scope.acceptTrade = function () {

        // Get the player and check if he/she has sufficient resources
        var tradePartner = GameService.getPlayerByColor($scope.tradeRequest.tradePartner);
        var offer = $scope.tradeRequest.offer;
        var demand = $scope.tradeRequest.demand;

        if (hasSufficientResources(tradePartner, demand)) {
            // tradePartner has adequate resources for trade. Execute trade.
            executeTrade(GameService.activePlayer, tradePartner, offer, demand);
        } else {
            $('#InsufficientResourceAlert').modal('show');
        }
    };

    function hasSufficientResources(player, resources) {
        var resAvail = player.getResources();
        for (var type in resources) {
            if (resources.hasOwnProperty(type)) {
                if (resAvail[type] < resources[type]) {
                    return false;
                }
            }
        }
        return true;
    }

    function executeTrade(player1, player2, offer, demand) {

        var player1Res = player1.getResources();
        var player2Res = player2.getResources();

        for (var type in offer) {
            if (offer.hasOwnProperty(type)) {
                // Decrement each type by specified amount in player1 and increment in player2
                // Note: allows for trading of the same type. i.e. 2 bricks for 1 brick.
                player1.decrementResource(type, offer[type]);
                player1.incrementResource(type, demand[type]);

                player2.decrementResource(type, demand[type]);
                player2.incrementResource(type, offer[type]);
            }
        }
    }

    $scope.rejectTrade = function () {
        console.log("Rejected Trade!");
    };
}])