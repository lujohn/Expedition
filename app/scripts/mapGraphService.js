
/* This service is a simple graph structure that helps keep track of the game state
and helps with accessing and adding buildings (on verticies) and roads (on edges) */

angular.module('expeditionApp')
.service('MapGraphService', function () {

	// Every vertex is identified by it's coordinates in the game board.
	this.verticies = {}; // Vertices in the Graph represent buildings (city / settlements)

	// Represents existing roads. Representation will be a hash of hashes. Outer hash
	// has fromCoordinates as a key to inner hash which will have toCoordinates as a key.
	// The value from the inner hash will be the color of the road.
	// {key => fromCoord, value => { key => toCoord, value => color } }	
	this.edges = {};  

	this.addVertex = function (coordinates) {
		// turn coordinates [x, y] into "x,y" for use as a key
		var coordString = coordinates.toString(coordinates);
		if (!this.verticies.hasOwnProperty(coordString)) {
			var newVertex = new Vertex(coordString);
			this.verticies[coordString] = newVertex;

			// Create entry in edges
			this.edges[coordString] = {};
			return true;
		}
		console.log('Tried to add duplicate vertex' + coordString);
		return false;
	}

	this.addEdge = function  (color, fromCoord, toCoord) {

		// Do not add duplicates
		if (this.hasEdge(fromCoord, toCoord)) {
			console.log("attempted to add duplicate edge!");
			return false;
		}

		// If either vertex does not exist, return false with no modifcations
		if (!this.hasVertex(fromCoord) || ! this.hasVertex(toCoord)) {
			console.log("attmpted to add edge to vertex that does not exist!");
			return false;
		}

		var v1 = coordinatesToString(fromCoord);
        var v2 = coordinatesToString(toCoord);
		this.edges[v1][v2] = color;
        this.edges[v2][v1] = color;

        return true;
	}

	this.hasVertex = function (coord) {
		return this.verticies.hasOwnProperty(coordinatesToString(coord));
	}

	this.hasEdge = function (fromCoord, toCoord) {
		var from = coordinatesToString(fromCoord);
		var to = coordinatesToString(toCoord);

		return this.edges.hasOwnProperty(from) && this.edges[from].hasOwnProperty(to);
	}

	/* ======================= Private Helper Functions ======================= */
	// Vertex constructor
	function Vertex() {
		this.color = null;
		this.type = null;
		this.available = true;
	}

	// converts [x,y] coordinates to string representation "x,y"
	function coordinatesToString(coordinates) {
		var x = coordinates[0];
		var y = coordinates[1];
		return  x + ',' + y;
	}

	// Helper function for marking verticies unavailable after settlement is built 
	function getNeighbors() {
		// TO IMPLEMENT...
	}

});