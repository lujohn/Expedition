
/* This will hand all of the drawing for the application. Including:
	-- Hexagons for the land
	-- Logic for piecing together the tiles
	-- Placement of Settlements, Cities, and Roads
	-- Moving the Robber
    -- Keep track of Map State.
        -- Use a Graph for storing hex verticies and edges. 
*/

angular.module('expeditionApp')
.service('MapService', ['GameService', function(GameService) {
	const COLOR_LOOKUP = {sheep : "#2eaa30", ore : "#bbbcb5", brick : "#842121", wood : "#663f1f", wheat : "#c4bb19"}

	// Constants used for drawing game board
    const HEX_WIDTH = 160;
    const HEX_HEIGHT = 160;
    const BASE_X_OFFSET = 0;
    const BASE_Y_OFFSET = 0;
    const ROW_OFFSET = (HEX_WIDTH / 2);
    const MID_ROW_IDX = 2;
    const VERT_GAP_CLOSE = 40; //HEX_HEIGHT / 3.4;
    this.createGameBoard = function () {
        // Draw the board row by row
        var numRows = GameService.landsMatrix.length;
        for (var row = 0; row < numRows; row++) {
            this.createRow(row);
        }
    };

    // Row number can be from 0 to 4
    this.createRow = function (rowNumber) {
        var nHexes = GameService.NUM_HEXES_IN_ROW[rowNumber];
        for (var i = 0; i < nHexes; i++) {
            this.createNewHex(rowNumber, i);
        }
    };

    this.createNewHex = function (rowNum, colNum) {

        // Draw the land
        var land = GameService.landsMatrix[rowNum][colNum];
        
        // Apply necessary offsets to get land into place.
        // Each row has different offsets from the left. 
        var xOffset = 0, yOffset = 0;
        xOffset = Math.abs(MID_ROW_IDX - rowNum) * ROW_OFFSET;
        // Additionally, shift left by hexagon's height * column
        xOffset += (HEX_WIDTH * colNum);
        // Shift down by hexagon's height * row
        yOffset = (HEX_HEIGHT - VERT_GAP_CLOSE) * rowNum;

        // This informatiom will be saved into the land object itself for later use
        // in adding buildings and roads.
        console.log("landID from drawNexHex(): " + land.landID + "xOffset: " + xOffset);
        var hexCoordinates = {
            A: [80 + xOffset, 0 + yOffset],
            B: [160 + xOffset, 40 + yOffset],
            C: [160 + xOffset, 120 + yOffset],
            D: [80 + xOffset, 160 + yOffset],
            E: [0 + xOffset, 120 + yOffset],
            F: [0 + xOffset, 40 + yOffset]
        };
        land.coordinates = hexCoordinates;

        drawHex(land, xOffset, yOffset);

        // DRAW DICE NUMBER WITH CANVAS
        /*
        var diceLabel = document.createElement("h1");
        diceLabel.innerHTML = land.diceNumber;
        diceLabel.style.left = xPos + 60 + "px";
        diceLabel.style.top = yPos + 40 + "px";
        diceLabel.style.position = "absolute";
        diceLabel.style.zIndex = "2000";
        gameContainer.appendChild(diceLabel);*/

    };

    function drawHex(land, xOffset, yOffset) {
        // Grab game container
        var gameContainer = document.getElementById("gameBoardContainer");

        // Create canvas element to contain new land
        var c = document.createElement("canvas");
        c.id = land.landID;
        c.width = HEX_WIDTH;
        c.height = HEX_HEIGHT;
        c.style.position = "absolute";
        c.style.left = xOffset + "px";
        c.style.top = yOffset + "px";

        // Grab context
        var ctx = c.getContext("2d");
        ctx.lineWidth = 4.0;
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
            console.log(GameService.landsDictionary[event.target.id]);
            var landClicked = event.target.id;

        });

         gameContainer.appendChild(c);
    }

}]);