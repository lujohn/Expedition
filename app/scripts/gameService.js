/**
 * Created by johnlu on 3/3/17.
 */
angular.module('expeditionApp')
.service('GameModel', function () {

    // Note: A graph lends itself very well to the structure of the game
    //var gameGraph

    var LAND_TYPES = ["sheep", "ore", "brick", "wood", "wheat"];
    var NUM_HEXES_IN_ROW = [3, 4, 5, 4, 3];
    var HEX_WIDTH = 130;
    var HEX_HEIGHT = 150;
    var BASE_X_OFFSET = 100;
    var BASE_Y_OFFSET = 100;
    var INCR_OFFSET = (HEX_WIDTH / 2);
    var MID_ROW_IDX = 2;
    var VERT_GAP_CLOSE = 37;
    LAND_MATRIX = [[],[],[],[],[]];  // Stores the lands in play for this game

    this.createGame = function () {
        // Generate land matrix randomly for now. Add in functionality to change later
        generateLandMatrix();
        drawGameBoard();
    };

    drawGameBoard = function () {
        // Draw the board row by row
        var numRows = LAND_MATRIX.length;
        for (var row = 0; row < numRows; row++) {
            drawRow(row);
            console.log("Drawing row " + row + "...\n");
        }
    };

    // Row number can be from 0 to 4
    drawRow = function (rowNumber) {
        var nHexes = NUM_HEXES_IN_ROW[rowNumber];
        for (var i = 0; i < nHexes; i++) {
            var xOffset = BASE_X_OFFSET + Math.abs(MID_ROW_IDX - rowNumber) * INCR_OFFSET;
            drawNewHex(xOffset, rowNumber, i);
            console.log("Drawing row: " + rowNumber + " Col: " + i);
        }
    };

    drawNewHex = function (xOffset, rowNum, colNum) {
        // Draw the land
        var hexID = LAND_MATRIX[rowNum][colNum].landID;
        console.log("hexID from drawNexHex(): " + hexID);

        // Grab game container
        var gameContainer = document.getElementById("gameBoardContainer");

        // Create new div element to hold land. ID must be set per
        // documentation for svg.js
        var svgDiv = document.createElement("div");
        svgDiv.id = hexID;

        // Apply necessary offsets to get land into place.
        console.log("x left shift: " + (xOffset + (HEX_WIDTH * colNum)));
        console.log("xOffset: " + xOffset + " HEX_WIDTH: " + HEX_WIDTH + " colNum: " + colNum);
        xPos = (xOffset + (HEX_WIDTH * colNum)) + "px";
        yPos = BASE_Y_OFFSET + (HEX_HEIGHT - VERT_GAP_CLOSE) * rowNum  + "px";
        svgDiv.style.position = "absolute";
        svgDiv.style.left = xPos;
        svgDiv.style.top = yPos;
        svgDiv.style.height = HEX_HEIGHT + "px";
        svgDiv.style.width = HEX_WIDTH + "px";

        // Add land div into container.
        gameContainer.appendChild(svgDiv);

        // Draw the land.
        var draw = SVG(hexID).size(HEX_WIDTH, HEX_HEIGHT);
        var hex = draw.path("m0,-75l64.9519052838329,37.49999999999999l0,75l-64.95190528383289,37.500000000000014l-64.9519052838329,-37.499999999999964l-4.263256414560601e-14,-74.99999999999999z");

        // Position the land. This brings the entire hex into view.
        hex.transform({x : HEX_WIDTH / 2, y : HEX_HEIGHT / 2});

        // Apply proper color to land
        //hex.fill = applyColor(landType)

    };

    var applyColor = function (landType) {

    }
    
    var generateLandMatrix = function () {
        // Generate Lands Randomly. Get a number randomly between 0 and 4 (inclusive)
        var count = 0;
        var numRows = LAND_MATRIX.length;
        for (var row = 0; row < numRows; row++) {
            var numCols = NUM_HEXES_IN_ROW[row];
            for (var col = 0; col < numCols; col++, count++) {
                var rand = Math.floor(Math.random() * 5);
                var landString = LAND_TYPES[rand];
                var newLand = {landID : "hex" + count.toString(), landType : landString};
                LAND_MATRIX[row].push(newLand);
                console.log("land generated -  id: " + newLand.landID + " type: " + newLand.landType);
            }
        }
    }
});