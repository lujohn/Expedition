/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService', function($scope, GameService) {
    $scope.welcome = "Welcome from the Game Controller!";
    GameService.createRandomGame();

    // BE SURE TO MOVE DRAWING LOGIG OUT OF GAMESERVICE
}]);