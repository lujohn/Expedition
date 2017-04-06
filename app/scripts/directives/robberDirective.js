angular.module('expeditionApp')
.directive('robber', function () {
	return {
		link: function (scope, element, attr) {

	        scope.$watch(attr.land, function(land) {
	        	console.log("hasRobber: ");
	        	console.log(land);

	        	var landWithRobber = attr.land;
        		// Remove robber from old location
        		if (document.getElementById("robber") !== null) {
        			console.log("entered here...")
        			gameBoardContainer.removeChild(document.getElementById("robber"));
        		} else {
        			console.log("did not enter");
        		}

        		var landCoordA = land.coordinates["A"];

        		var xOffset = landCoordA[0] - 80;
	       		var yOffset = landCoordA[1];

		        var robberImg = document.createElement('img');
		        robberImg.width = 60;
		        robberImg.height = 60;
		        robberImg.src = "images/robber.svg";
		        robberImg.style.position = "absolute";
		        robberImg.style.left = xOffset + (80 - robberImg.width / 2) + "px" ;  // **Add constants
		        robberImg.style.top = yOffset + (80 - robberImg.height / 2) + "px";
		        robberImg.id = "robber"

		        robberImg.style.zIndex = 201;
		        gameBoardContainer.appendChild(robberImg);
        	
		    });

		}
	}; 
});