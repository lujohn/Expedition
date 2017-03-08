
/* This will hand all of the drawing for the application. Including:
	-- Hexagons for the land
	-- Logic for piecing together the tiles
	-- Placement of Settlements, Cities, and Roads
	-- Moving the Robber
*/

angular.module('expeditionApp')
.service('MapService', ['GameService', function(GameService) {
	//const COLOR_LOOKUP = {sheep : "#2eaa30", ore : "#bbbcb5", brick : "#842121", wood : "#663f1f", wheat : "#c4bb19"}

	// Constants used for drawing game board
    const HEX_WIDTH = 130;
    const HEX_HEIGHT = 150;
    const BASE_X_OFFSET = 0;
    const BASE_Y_OFFSET = 0;
    const ROW_OFFSET = (HEX_WIDTH / 2);
    const MID_ROW_IDX = 2;
    const VERT_GAP_CLOSE = HEX_HEIGHT / 3.4;


    this.drawGameBoard = function () {
        // Draw the board row by row
        var numRows = GameService.landsMatrix.length;
        for (var row = 0; row < numRows; row++) {
            this.drawRow(row);
            console.log("Drawing row " + row + "...\n");
        }
    };

    // Row number can be from 0 to 4
    this.drawRow = function (rowNumber) {
        var nHexes = GameService.NUM_HEXES_IN_ROW[rowNumber];
        for (var i = 0; i < nHexes; i++) {
            var xOffset = Math.abs(MID_ROW_IDX - rowNumber) * ROW_OFFSET;
            this.drawNewHex(xOffset, rowNumber, i);
            console.log("Drawing row: " + rowNumber + " Col: " + i);
        }
    };

    this.drawNewHex = function (xOffset, rowNum, colNum) {

        // Configure land position. This function inserts the coordinates of the 
        // hexagonal lands into the land objects themselves. These coordinates will
        // later be used for drawing building settlements and roads.
        configureLandPositions(GameService.landsMatrix);

        // Draw the land
        var land = GameService.landsMatrix[rowNum][colNum];
        console.log("landID from drawNexHex(): " + land.landID);

        // Grab game container
        var gameContainer = document.getElementById("gameBoardContainer");

        // Create new div element to hold land. ID must be set per
        // documentation for svg.js
        var landImage = document.createElement("img");
        landImage.src = "images/grain.png"
        landImage.id = land.landID;

        // !!!PUT INSIDE CSS SHEET LATER!!!
        landImage.style.height = HEX_HEIGHT + "px";
        landImage.style.width = HEX_WIDTH + "px";
        landImage.style.position = "absolute";

        // Apply necessary offsets to get land into place.
        xPos = (xOffset + (HEX_WIDTH * colNum));
        yPos = (HEX_HEIGHT - VERT_GAP_CLOSE) * rowNum;
        landImage.style.left = xPos + "px";
        landImage.style.top = yPos + "px";

        // Add handler for click
        landImage.addEventListener("click", function (event) {
            console.log(GameService.landsDictionary[event.target.id]);
            var landClicked = event.target.id;

        });

        // Fix Offsetting Later...
        var diceLabel = document.createElement("h1");
        diceLabel.innerHTML = land.diceNumber;
        diceLabel.style.left = xPos + 60 + "px";
        diceLabel.style.top = yPos + 40 + "px";
        diceLabel.style.position = "absolute";
        diceLabel.style.zIndex = "2000";
        gameContainer.appendChild(diceLabel);

        // Add land div into container.
        gameContainer.appendChild(landImage);
    };

    function configureLandPositions(lands) {
        
    }
}]);