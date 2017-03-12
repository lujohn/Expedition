angular.module('expeditionApp')
.directive('landHex', function () {
	const COLOR_LOOKUP = {sheep : "#2eaa30", ore : "#bbbcb5", brick : "#842121", wood : "#663f1f", wheat : "#c4bb19"};
	return {
		link: function (scope, element, attr) {
	        // Create canvas element to contain new land
	        console.log("from landHex directive");
	        var c = document.createElement("canvas");
	        c.width = 160;
	        c.height = 160;

	        var landID = attr.id;
	        console.log("From directive: " + landID);
	        var landToDraw = scope.landsDictionary[landID];
	        var landCoordA = landToDraw.coordinates["A"];

	        var xOffset = landCoordA[0] - 80;
	        var yOffset = landCoordA[1];
	        c.style.left = xOffset + "px";
	        c.style.top = yOffset + "px";

	        // Grab context
	        var ctx = c.getContext("2d");
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

	        document.getElementById("gameBoardContainer").appendChild(c);

	        // Add event listener
	        c.addEventListener('click', function () {
	        	console.log("land clicked");
	        	scope.$apply(scope.clickedLand(landID));

	        	if (scope.BUILDING_STATE) {
	        		console.log("clicked land in building state (from landDirective)");
	        		// Draw the hex inside action box
	        		
	        	}
	        });
		}
	}; 
});