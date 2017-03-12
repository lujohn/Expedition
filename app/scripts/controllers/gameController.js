/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.controller('GameController', ['$scope', 'GameService', 'MapService', 
    function ($scope, GameService, MapService) {

    const PLAYER_COLORS = ["red", "blue", "yellow", "white"];

    $scope.turnsOrder = []  // Array of player colors indicating turn order.

    /* =========================== For Testing Only ================================ */
    $scope.showStartButton = true;
    $scope.INITIAL_STATE = false;
    $scope.ACTIVE_STATE = false;
    $scope.BUILDING_STATE = false;

    $scope.landSelected = null;  // holds the last clicked land
    $scope.activePlayer = null;

    // TESTING WITH MOCK SETUP. USE ANGULAR FORM TO POPULATE INFO.
    $scope.start = function () {
        GameService.createRandomGame(2);
        MapService.assignCoordinatesToLands(GameService.landsMatrix);
        GameService.addPlayers(['red', 'blue', 'yellow']);
        $scope.turnsOrder = ['red', 'blue', 'yellow'];

        $scope.landsArray = GameService.landsMatrix;
        $scope.landsDictionary = GameService.landsDictionary;

        $scope.activePlayer = GameService.getPlayerByColor('red');  // for testing. After, just set to first player in turnsOrder array

        $scope.showStartButton = false;
        $scope.INITIAL_STATE = true;
    }

    /* --------------------------- INITIAL_STATE logic ---------------------------- */
    $scope.selectionsBuffer = {red: [], blue: [], yellow: []}
    $scope.selectedInitialSettlement = function (hexCorner) {
        var activePlayer = $scope.activePlayer;
        var land = $scope.landSelected;
        console.log(activePlayer.color + " you selected a " + land.type + " corner: " + hexCorner);

        $scope.selectionsBuffer[activePlayer.color].push(land);

        $scope.activePlayer = getNextPlayer();
    }

    $scope.selectedInitialRoad = function (corner1, corner2) {
        var activePlayer = $scope.activePlayer;
    }

    $scope.toggleBuildingState = function () {
        $scope.BUILDING_STATE = !$scope.BUILDING_STATE;
    }
            
    /* ------------------------- Player Action Handlers ---------------------------- */
    $scope.clickedLand = function (landID) {
        console.log(landID);
        $scope.landSelected = $scope.landsDictionary[landID];
        // if ($scope.BUILDING_STATE) {
        //     var landSelected = this.landsDictionary[landID];
        //     $scope.landSelected = landSelected;
        // }
    }   


    $scope.offeredTrade = function (otherPlayerColor) {
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
    }

    /* --------------------------------- Helper functions ----------------------------- */
    function getNextPlayer() {
        var idx = $scope.turnsOrder.indexOf($scope.activePlayer.color) 
        console.log("index of player is: " + idx);
        if (idx === $scope.turnsOrder.length - 1) {
            return GameService.getPlayerByColor($scope.turnsOrder[0]);
        } else {
            return GameService.getPlayerByColor($scope.turnsOrder[idx+1])
        }

    }

    function beginNextTurn() {
    	$scope.activePlayer = GameService.getActivePlayer();
    }									

    // NOTE: DOM MANIPULATION SHOULD BE MOVED OUT OF CONTROLLER AND INTO DIRECTIVE
    /* --------------------------------- Drawing Logic -------------------------------- */
    drawGame = function () {
        var lands = GameService.landsMatrix;
        for (var i = 0; i < lands.length; i++) {
            for (var j = 0; j < lands[i].length; j++) {
                drawHex(lands[i][j]);
            }
        }
    }

    $scope.drawHex = function(land) {
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

    function clickedLand (landID) {
        // use $apply here since call to this function is made directly from browser.
        $scope.$apply($scope.clickedLand(landID));
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