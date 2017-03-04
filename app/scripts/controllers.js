/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameModel', function($scope, GameModel) {
    $scope.welcome = "Welcome from the Game Controller!";
    GameModel.createGame();
}]);