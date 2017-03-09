
/* This service is a simple graph structure that helps keep track of the game state
and helps with accessing and adding buildings (on verticies) and roads (on edges) */

angular.module('expeditionApp')
.service('MapService', ['GameService', function(GameService) {

	// Every vertex is identified by it's coordinates in the game board.
	function MapGraph() {
		this._verticies = {};
		this.edges = {}; // ("color", from, to )

		this.addVertex = function (coordinates) {

		}
	}
}]);