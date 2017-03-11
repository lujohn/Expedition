/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService', 'MapService', 
    function ($scope, GameService, MapService) {
    const COLOR_LOOKUP = {sheep : "#2eaa30", ore : "#bbbcb5", brick : "#842121", wood : "#663f1f", wheat : "#c4bb19"};
    const PLAYER_COLORS = ["red", "blue", "yellow", "white"];

    var turnsOrder = []  // Array of player colors indicating turn order.

    /* =========================== For Testing Only ================================ */
    $scope.showStartButton = true;
    $scope.INITIAL_STATE = false;
    $scope.ACTIVE_STATE = false;
    $scope.BUILDING_STATE = false;

    $scope.start = function () {
        GameService.createRandomGame(2);
        MapService.assignCoordinatesToLands(GameService.landsMatrix);
        GameService.addPlayers(['red', 'blue']);

        $scope.activePlayer = GameService.getPlayerByColor('red');

        $scope.showStartButton = false;
        $scope.INITIAL_STATE = true;

        drawGame();
    }
            
    /* ------------------------- Player Action Handlers ---------------------------- */
    $scope.offerTrade = function (otherPlayerColor) {
    	console.log("offer trade");
    }

    // End turn button clicked
    $scope.endTurn = function () {
    	// Check if game is over
    	console.log("end turn");
    	var playerWon = GameService.gameWon();
    	if (!playerWon) {
    		GameService.endTurn();
    		beginNextTurn();
    	}
    }

    $scope.determinePlayerOrder = function () {
    	// Do dice Roll Animation? 
    	console.log("determine player order");
    	$scope.showPlayerPanel();
    }

    function beginNextTurn() {
    	$scope.activePlayer = GameService.getActivePlayer();
    }

    function clickedLand (landID) {
        console.log("$scope.BUILDING_STATE"); 
        $scope.BUILDING_STATE = !$scope.BUILDING_STATE;
        $scope.presentLand = GameService.getLandWithID(landID);
        console.log($scope.BUILDING_STATE); 
        console.log(GameService.getLandWithID(landID));
    }														


    /* --------------------------------- Drawing Logic -------------------------------- */
    drawGame = function () {
        var lands = GameService.landsMatrix;
        for (var i = 0; i < lands.length; i++) {
            for (var j = 0; j < lands[i].length; j++) {
                drawHex(lands[i][j]);
            }
        }
    }

    function drawHex(land) {
        // Grab game container
        var gameContainer = document.getElementById("gameBoardContainer");

        // Create canvas element to contain new land
        var c = document.createElement("canvas");
        c.id = land.landID;
        c.width = 160;
        c.height = 160;

        var landCoordA = land.coordinates["A"];
        var xOffset = landCoordA[0] - 80;
        var yOffset = landCoordA[1];
        c.style.left = xOffset + "px";
        c.style.top = yOffset + "px";

        // Grab context
        var ctx = c.getContext("2d");
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "#fff328";
        ctx.fillStyle = COLOR_LOOKUP[land.type];

        // Draw land piece
        ctx.beginPath();
        ctx.moveTo(80,0);
        ctx.lineTo(160,40);
        ctx.lineTo(160,120);
        ctx.lineTo(80,160);
        ctx.lineTo(0,120);
        ctx.lineTo(0,40);
        ctx.lineTo(80,0);
        ctx.closePath();

        ctx.stroke();     
        ctx.fill();

        // Add handler for click
        c.addEventListener("click", function (event) {
            clickedLand(event.target.id);
        });
        gameContainer.appendChild(c);
    }

    this.drawRoad = function () {
        /*var c = document.getElementById("land10");
        var ctx = c.getContext("2d");
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#000000";

        console.log("drawing road... from: x: " + road.from[0] + " y: " + road.from[1]);
        console.log("to: x: " + road.to[0] + " y: " + road.to[1]);
        ctx.beginPath();
        ctx.moveTo(80, 0);
        ctx.lineTo(160, 40);
        ctx.closePath();
        ctx.stroke();*/
    }
}])