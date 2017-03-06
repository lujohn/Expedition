/**
 * Created by johnlu on 3/3/17.
 */

angular.module('expeditionApp')
.service('GameService', ['LandFactory', function (LandFactory) {
    // Constant Variables
    const LAND_TYPES = ["sheep", "ore", "brick", "wood", "wheat"];
    //const COLOR_LOOKUP = {sheep : "#2eaa30", ore : "#bbbcb5", brick : "#842121", wood : "#663f1f", wheat : "#c4bb19"}
    const NUM_HEXES_IN_ROW = [3, 4, 5, 4, 3];
    const HEX_WIDTH = 130;
    const HEX_HEIGHT = 150;
    const BASE_X_OFFSET = 0;
    const BASE_Y_OFFSET = 0;
    const INCR_OFFSET = (HEX_WIDTH / 2);
    const MID_ROW_IDX = 2;
    const VERT_GAP_CLOSE = HEX_HEIGHT / 3.4;

    // Stores the lands in play for this game
    let LAND_MATRIX = [[],[],[],[],[]]; 
    // Stores lands for later lookup
    let LAND_DICTIONARY = {}

    this.createRandomGame = function () {
        // Generate lands randomly for now. MODIFY
        generateLandsRandom();
        // Assign dice numbers to land
        assignLandDiceNumbersRandom();

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
        var land = LAND_MATRIX[rowNum][colNum];
        console.log("landID from drawNexHex(): " + land.landID);

        // Grab game container
        var gameContainer = document.getElementById("gameBoardContainer");

        // Create new div element to hold land. ID must be set per
        // documentation for svg.js
        var landImage = document.createElement("img");
        landImage.src = "images/grain.png"
        landImage.id = land.landID;

        // PUT INSIDE CSS SHEET LATER
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
            console.log(LAND_DICTIONARY[event.target.id]);
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
    
    var generateLandsRandom = function () {
        // Generate Lands Randomly. Get a number randomly between 0 and 4 (inclusive)
        var count = 0;
        var numRows = LAND_MATRIX.length;
        for (var row = 0; row < numRows; row++) {
            var numCols = NUM_HEXES_IN_ROW[row];
            for (var col = 0; col < numCols; col++, count++) {
                // Calculate a random land type
                var rand = Math.floor(Math.random() * 5);
                var landType = LAND_TYPES[rand];
                // Use Land Factory to create a land
                var newLand = LandFactory.createLand(landType);
                newLand.landID = "land" + count.toString();
                // Store new land
                LAND_MATRIX[row].push(newLand);
                LAND_DICTIONARY[newLand.landID] = newLand; 
                console.log("land generated => " + newLand);
            }
        }
    }

    var assignLandDiceNumbersRandom = function () {
        var possibleNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
        for (var i = 0; i < possibleNumbers.length; i++) {
            LAND_DICTIONARY["land" + i].diceNumber = possibleNumbers[i];
        }
    }
}]);