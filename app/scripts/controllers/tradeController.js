angular.module('expeditionApp')
.controller('TradeController', ['$scope', 'GameService', function ($scope, GameService) {

    // -------------------------- For Bank Trades ----------------------------
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
        var rate = activePlayer.bankExchangeRates[offerType];
                    console.log("available: " + resAvail[offerType]);
            console.log(activePlayer.bankExchangeRates[offerType]);
        if (resAvail[offerType] >= rate) {
            activePlayer.decrementResource(offerType, rate);
            activePlayer.incrementResource(demandType, 1);
        } else {
            $('#InsufficientResourceAlert').modal('show');
        }
    };

    // ----------------------- For Player to Player Trades -----------------------
    $scope.tradeRequest = {
        tradePartner: null,
        offer: { wool: 0, lumber: 0, grain: 0, ore: 0, brick: 0},
        demand: { wool: 0, lumber: 0, grain: 0, ore: 0, brick: 0}
    };

    // $scope.setTradePartner = function (player) {
    //     $scope.tradeRequest.tradePartner = player;
    // }

    $scope.submitTradeRequest = function () {
        console.log("trading with: " + $scope.tradeRequest.tradePartner);
        // Check for sufficient resources
        var offer = $scope.tradeRequest.offer;
        var activePlayer = GameService.activePlayer;

        if (activePlayer.hasSufficientResources(offer)) {
            // present trade modal to other party
            $('#tradeAcceptModal').modal('show');
        } else {
            $('#InsufficientResourceAlert').modal('show');
        }
    };

    $scope.acceptTrade = function () {

        // Get the player and check if he/she has sufficient resources
        var tradePartner = $scope.tradeRequest.tradePartner;
        var offer = $scope.tradeRequest.offer;
        var demand = $scope.tradeRequest.demand;

        if (tradePartner.hasSufficientResources(demand)) {
            // tradePartner has adequate resources for trade. Execute trade.
            executeTrade(GameService.activePlayer, tradePartner, offer, demand);
        } else {
            $('#InsufficientResourceAlert').modal('show');
        }
    };

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