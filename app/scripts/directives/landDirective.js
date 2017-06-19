angular.module('expeditionApp')
.directive('landHex', ['GameService', 'LANDHEX', 'Harbors', function (GameService, LANDHEX, Harbors) {
	
	_GameService = GameService;
	const COLOR_LOOKUP = {wool : "#2eaa30", ore : "#bbbcb5", brick : "#842121", lumber : "#663f1f", grain : "#c4bb19", desert : "#d7f276"};
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			// Grab the land to work on
	        var landID = attr.id;

	        // landsDictionary inherited from MapController Scope
	        var landToDraw = _GameService.landsDictionary[landID];  // **Use Dependency Injection Here (GameService)
	        var landCoordA = landToDraw.coordinates["A"];

	        // Set display of land
	        var landCanvas = element[0];
	        var xOffset = landCoordA[0] + LANDHEX.SHIFT_BOARD_X;
	        var yOffset = landCoordA[1];

	        landCanvas.width = 160;  // **Change to Angular Constant 
	        landCanvas.height = 160;
	        landCanvas.style.left = xOffset + "px";
	        landCanvas.style.top = yOffset + "px";
	        landCanvas.style.zIndex = 1;
	        landCanvas.style.position = 'absolute';
	        landCanvas.landType = landToDraw.type;

	        // This property will be used to bolden the border when user hovers
	        landCanvas.isHovering = false;
	        landCanvas.isLastClicked = false;

	        // draw the land
	        drawLand(landCanvas);

	        /* ----------------- Event listeners for land canvas ----------------- */
	        // Add thicker border to lands when user hovers
	        landCanvas.addEventListener('mouseover', function(event) {
	        	this.isHovering = true;
	        	drawLand(this);
	        });
	        landCanvas.addEventListener('mouseout', function(event) {
	        	this.isHovering = false;
	        	drawLand(this);
	        })

	        // When land is clicked, highlight the selected land with a different color
	        var landClickedEvent = function (event) {
	        	if (_GameService.lastLandSelected !== null) {
	        		var landCanvas = document.getElementById(game.lastLandSelected.landID);
	        		// removes thick bordering from previous selected land 
	        		landCanvas.isLastClicked = false;
	        		drawLand(landCanvas);
	        	}
	        	event.target.isLastClicked = true;
	        	drawLand(event.target);
	        	scope.$apply(_GameService.setLastLandSelected(event.target.id));
	        }
	        landCanvas.addEventListener('click', landClickedEvent);

	        /* -------------------------- drawLand() ------------------------------- */
	        function drawLand(landCanvas) {
	        	// Grab land canvas context text
		        var ctx = landCanvas.getContext("2d");
		        ctx.clearRect(0, 0, landCanvas.width, landCanvas.height);
		        if (landCanvas.isHovering || landCanvas.isLastClicked) {
		        	ctx.lineWidth = 4.0;
		        } else {
		        	ctx.lineWidth = 1.0;
		        }

		        if (landCanvas.isLastClicked) {
		        	ctx.strokeStyle = "#96fff9";
		        } else {
		        	ctx.strokeStyle = "#000000";
		        }
		       	
		       	// Set stroke color and land color
		        ctx.fillStyle = COLOR_LOOKUP[landCanvas.landType];

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

		        // Must fill before stroke here or else adjacent land colors will erase
		        // each other's borders
		        ctx.fill();
		        ctx.stroke();   
	        }

	        // *** Move Dice Image to Own Directive *** 
	        // Create the Dice Number associated with the land. Desert has no dice number
	        if (landToDraw.type !== "desert") {
	        	var diceNumberImage = document.createElement("img");
		        diceNumberImage.width = 40;
		        diceNumberImage.height = 40;
		        diceNumberImage.src = "images/landNumber" + landToDraw.diceNumber + ".svg";
		        diceNumberImage.style.position = "absolute";

		        // 80 is half of LandHEX
		        diceNumberImage.style.left = xOffset + (80 - diceNumberImage.width / 2) + "px" ;  // **Add constants
		        diceNumberImage.style.top = yOffset + (80 - diceNumberImage.height / 2) + "px";

		        // So dice will display on top of land
		        diceNumberImage.style.zIndex = 101;

    	        // Add dice number to game board
		        gameBoardContainer.appendChild(diceNumberImage);
	        }

	        // Add harbor if one exists
	        if (Harbors.locations.hasOwnProperty(landToDraw.landID)) {
	        	var harbors = Harbors.locations[landToDraw.landID];
	        	var harborImg = document.createElement('img');
		        harborImg.src = 'images/' + landToDraw.harborType + '.png'
		        harborImg.width = harborImg.height = 40;
		        harborImg.style.position = "absolute";

		        switch (harbors) {
		        	case 'A-B':
		        		harborImg.style.left = xOffset + (3 * LANDHEX.WIDTH / 4) + 'px';
		        		harborImg.style.top = yOffset - (harborImg.height / 2) + 'px';
		        		break;
		        	case 'B-C':
		        		harborImg.style.left = xOffset + LANDHEX.WIDTH + (harborImg.width / 4) + 'px';
		        		harborImg.style.top = yOffset + (LANDHEX.HEIGHT / 2) - (harborImg.height / 2) + 'px';
		        		break;
		        	case 'C-D':
		        		harborImg.style.left = xOffset + (3 * LANDHEX.WIDTH / 4) + 'px';
		        		harborImg.style.top = yOffset + LANDHEX.HEIGHT - (harborImg.height / 2) + 'px';
		        		break;
		        	case 'D-E':
		        		harborImg.style.left = xOffset + (harborImg.width / 4) + 'px';
		        		harborImg.style.top = yOffset + LANDHEX.HEIGHT - (harborImg.height / 2) + 'px';	
		        		break;	        		
		        	case 'E-F':
		        		harborImg.style.left = xOffset - (harborImg.width + harborImg.width / 4) + 'px';
		        		harborImg.style.top = yOffset + (LANDHEX.HEIGHT / 2) - (harborImg.height / 2) + 'px';
		        		break;
		        	case 'F-A':
		        		harborImg.style.left = xOffset + 'px';
		        		harborImg.style.top = yOffset - (harborImg.height / 2) + 'px';
		        }

		        harborImg.style.zIndex = 101;

		        // Add dice number to game board
		        gameBoardContainer.appendChild(harborImg);
	        }
		}
	}; 
}]);