angular.module('expeditionApp')
.controller('RobberController', ['$scope', 'GameService', function($scope, GameService) {

    $scope.playerDiscarding = null;
    $scope.discardBuffer = new discardBuffer();
    $scope.count = 0;

    $scope.$watch('discardBuffer', function (newVal, oldVal) {
        updateCount();
    }, true);

    var queue = [];
    var allPlayers = GameService.getAllPlayers();
    $scope.prepareForDiscard = function () {
        for (var i = 0; i < allPlayers.length; i++) {
            var player = allPlayers[i];
            var numRes = player.getNumResources();
            if (numRes > 7) {
                player.numCardsToDiscard = (numRes - 7);  // Create property
                player.numResources = numRes;  // To make visible to Modal
                queue.push(player);
            }
        }

        // Present first player's discard modal if queue is not empty
        if (queue.length > 0) {
            $scope.playerDiscarding = queue.shift();
            $('#discardModal').modal('show');
        } 
    }

    $scope.discard = function () {
        // Decrement resources
        var buf = $scope.discardBuffer;
        var player = $scope.playerDiscarding;
        
        player.decrementResource('wool', buf.wool);
        player.decrementResource('lumber', buf.lumber);
        player.decrementResource('grain', buf.grain);
        player.decrementResource('ore', buf.ore);
        player.decrementResource('brick', buf.brick);

        if (queue.length > 0) {
            // Present next player's discard modal
            $scope.playerDiscarding = queue.shift();
            $('#discardModal').modal('show');
        } else {
            $('#discardModal').modal('hide');
            $('#placeRobberModal').modal('show');
        }

        // provide clean buffer for next player
        $scope.discardBuffer = new discardBuffer();
    };

    function updateCount () {
        var count = 0;
        for (var type in $scope.discardBuffer) {
            if ($scope.discardBuffer.hasOwnProperty(type)) {
                count += $scope.discardBuffer[type];
            }
        }
        $scope.count = count;
    };

    function discardBuffer () {
        this.wool = 0;
        this.lumber = 0;
        this.grain = 0;
        this.ore = 0;
        this.brick = 0;
    };

}])
;