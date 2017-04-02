angular.module('expeditionApp')
.directive('landHex', function () {
	const COLOR_LOOKUP = {wool : "#2eaa30", ore : "#bbbcb5", brick : "#842121", lumber : "#663f1f", grain : "#c4bb19", desert : "#d7f276"};
	return {
		link: function (scope, element, attr) {

			// Grab the land to work on
	        var landID = attr.id;
	        var landToDraw = scope.landsDictionary[landID];  // **Use Dependency Injection Here (GameService)
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

	        // This property will be used to bolden the border when user hovers
	        landCanvas.isHovering = false;

	       	// Get the gameBoard to add land canvas and dice image on.
			var gameBoardContainer = document.getElementById("gameBoardContainer");
	        gameBoardContainer.appendChild(landCanvas);

	        drawLand(landCanvas);

	        function drawLand(landCanvas) {
	        	// Grab land canvas context text
		        var ctx = landCanvas.getContext("2d");
		        ctx.clearRect(0, 0, landCanvas.width, landCanvas.height);
		        if (landCanvas.isHovering) {
		        	ctx.lineWidth = 4.0;
		        } else {
		        	ctx.lineWidth = 1.0;
		        }
		       	
		       	// Set stroke color and land color
		        ctx.strokeStyle = "#000000";
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

		        // Must fill before stroke or else adjacent land colors will erase
		        // each other's borders
		        ctx.fill();
		        ctx.stroke();   
	        }

	        // Handle user hovering
	        landCanvas.addEventListener('mouseover', function(event) {
	        	this.isHovering = true;
	        	drawLand(this);
	        });

	        landCanvas.addEventListener('mouseout', function(event) {
	        	this.isHovering = false;
	        	drawLand(this);
	        })

	        // Event handler for land and dice number clicks
	        var landClickedEvent = function () {
	        	scope.$apply(scope.selectedLandWithID(landID));
	        }
	        
	        // Create the Dice Number associated with the land. Desert has no dice number
	        if (landToDraw.type !== "desert") {
	        	var diceNumberImage = document.createElement("img");
		        diceNumberImage.width = 40;
		        diceNumberImage.height = 40;
		        diceNumberImage.src = "images/landNumber" + landToDraw.diceNumber + ".svg";
		        diceNumberImage.style.position = "absolute";
		        diceNumberImage.style.left = xOffset + (80 - diceNumberImage.width / 2) + "px" ;  // **Add constants
		        diceNumberImage.style.top = yOffset + (80 - diceNumberImage.height / 2) + "px";

		        // So dice will display on top of land
		        diceNumberImage.style.zIndex = 2;

		        // Register event handler with dice number
    	        diceNumberImage.addEventListener('click', landClickedEvent);

    	        // Add dice number to game board
		        gameBoardContainer.appendChild(diceNumberImage);
	        }

	        // Add event listener
	        landCanvas.addEventListener('click', landClickedEvent);
		}
	}; 
});