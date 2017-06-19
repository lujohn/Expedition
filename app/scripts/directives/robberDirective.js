angular.module('expeditionApp')
.directive('robber', ['GameService', 'LANDHEX', function (GameService, LANDHEX) {
	game = GameService;
	return {

		link: function (scope, element, attr) {

			scope.$watch(attr.land, function (land) {
	        	console.log("hasRobber: ");
	        	console.log(land);

        		// Remove robber from old location
        		if (document.getElementById("robber") !== null) {
        			gameBoardContainer.removeChild(document.getElementById("robber"));
        		}

        		// Add robber to new location
        		var landCoordA = land.coordinates["A"];
        		var xOffset = landCoordA[0] - 80;
	       		var yOffset = landCoordA[1];

		        var robberImg = document.createElement('img');
		        robberImg.width = 100;
		        robberImg.height = 100;
		        robberImg.src = "images/robber2.png";
		        robberImg.style.position = "absolute";
		        robberImg.style.left = xOffset + (80 - robberImg.width / 2) + "px" ;  // **Add constants
		        robberImg.style.top = yOffset + (80 - robberImg.height / 2) + "px";
		        robberImg.id = "robber"

		        robberImg.style.zIndex = 201;
		        gameBoardContainer.appendChild(robberImg);
			});
		}
	}; 
}]);