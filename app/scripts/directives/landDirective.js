angular.module('expeditionApp')
.directive('landHex', function () {
	const COLOR_LOOKUP = {sheep : "#2eaa30", ore : "#bbbcb5", brick : "#842121", wood : "#663f1f", wheat : "#c4bb19"};
	return {
		link: function (scope, element, attr) {

			// Grab the land to work on
	        var landID = attr.id;
	        var landToDraw = scope.landsDictionary[landID];
	        var landCoordA = landToDraw.coordinates["A"];

	       	// Create canvas element to contain new land
	        var landCanvas = document.createElement("canvas");
	        var xOffset = landCoordA[0] - 80;
	        var yOffset = landCoordA[1];


	        landCanvas.width = 160;  // **Change to Angular Constant 
	        landCanvas.height = 160;
	        landCanvas.style.left = xOffset + "px";
	        landCanvas.style.top = yOffset + "px";
	        landCanvas.style.zIndex = 1;

	        // Grab land canvas context text
	        var ctx = landCanvas.getContext("2d");
	        ctx.lineWidth = 1.0;
	        ctx.strokeStyle = "#fff328";
	        ctx.fillStyle = COLOR_LOOKUP[landToDraw.type];

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

	        // Create the Dice Number associated with the land
	        var diceNumberImage = document.createElement("img");
	        diceNumberImage.width = 40;
	        diceNumberImage.height = 40;
	        diceNumberImage.src = "images/landNumber" + landToDraw.diceNumber + ".svg";
	        diceNumberImage.style.position = "absolute";
	        diceNumberImage.style.left = xOffset + (80 - diceNumberImage.width / 2) + "px" ;  // **Add constants
	        diceNumberImage.style.top = yOffset + (80 - diceNumberImage.height / 2) + "px";
	      

	        // So dice will display on top of land
	        diceNumberImage.style.zIndex = 2;

	   		// Get the gameBoard to add land canvas and dice image on.
	        var gameBoardContainer = document.getElementById("gameBoardContainer");
	        gameBoardContainer.appendChild(diceNumberImage);
	        gameBoardContainer.appendChild(landCanvas);

	        // Register event listener to land and dice number
	        var landClickedEvent = function () {
	        	scope.$apply(scope.selectedLandWithID(landID));
	        }

	        // Add event listener
	        landCanvas.addEventListener('click', landClickedEvent);
	        diceNumberImage.addEventListener('click', landClickedEvent);

		}
	}; 
});