
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

	// Every vertex has one, two, or three lands that it controls. This function
	// assigns those lands to the vertex
	this.registerLandToVertex = function (land, coord) {
		var vertex = this.getVertex(coord);
		vertex.lands.push(land);
	}

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
		return false;
	}

	this.addEdge = function (color, fromCoord, toCoord) {

		// Do not add duplicates
		if (this.hasEdge(fromCoord, toCoord)) {
			return false;
		}

		// If either vertex does not exist, add them in. Note: Shouldn't happen, but just in case.
		if (!this.hasVertex(fromCoord)) {
			var coordString = coordinatesToString(fromCoord);
			var newVertex = new Vertex(coordString);
			this.verticies[coordString] = newVertex
		}

		if (!this.hasVertex(toCoord)) {
			var coordString = coordinatesToString(toCoord);
			var newVertex = new Vertex(coordString);
			this.verticies[coordString] = newVertx;
		}

		// setEdge will set edge both directions
		this.setEdge(color, fromCoord, toCoord);
        return true;
	}

	this.setEdge = function (color, from, to) {
		var edges = this.getEdges(from);
		edges[coordinatesToString(to)] = color;

		// Add edge both ways
		edges = this.getEdges(to);
		edges[coordinatesToString(from)] = color;
	}


	this.setVertex = function (color, type, coord) {
		var vertex = this.getVertex(coord);
		vertex.color = color;
		vertex.type = type;
		vertex.available = false;
	}

	this.hasVertex = function (coord) {
		return this.verticies.hasOwnProperty(coordinatesToString(coord));
	}

	this.hasEdge = function (fromCoord, toCoord) {
		var from = coordinatesToString(fromCoord);
		var to = coordinatesToString(toCoord);

		return this.edges.hasOwnProperty(from) && this.edges[from].hasOwnProperty(to);
	}

	this.getVertex = function (coord) {
		if (this.hasVertex(coord)) {
			return this.verticies[coordinatesToString(coord)];
		}
		return null;
	}

	this.getEdges = function (coord) {
		if (this.hasVertex(coord)) {
			return this.edges[coordinatesToString(coord)];
		}
		return null;
	}

	this.getEdgeColor = function (from, to) {
		var edges = this.getEdges(from);
		return edges[coordinatesToString(to)];
	}

	// This function returns the verticies adjacent to the given vertex.
	// Primary use is for determining valid locations to build settlements.
	this.getAdjacentVerticies = function (coord) {
		var vertex = this.getVertex(coord);
		var coordStr = coordinatesToString(coord);
		// Grab the edges for this vertex
		var edgesForCoord = this.edges[coordStr];

		// Find and store all adjacent verticies
		var adjVerticies = [];
		for (var toCoordStr in edgesForCoord) {
			if (edgesForCoord.hasOwnProperty(toCoordStr)) {
				adjVerticies.push(this.verticies[toCoordStr]);
			}
		}
		return adjVerticies;
	}

	/* ============================= For Debugging ============================= */
	this.getNumVerticies = function () {
		var count = 0;
		for (var prop in this.verticies) {
			if (this.verticies.hasOwnProperty(prop)) {
				count++;
			}
		}
		return count;
	}

	/* ======================= Private Helper Functions ======================= */
	// Vertex constructor
	function Vertex() {
		this.color = null;  // owner
		this.type = null;  // settlement or building
		this.available = true;  // is vertex available
		this.lands = [];  // Lands that this vertex controls

		this.toString = function () {
			return "color: " + this.color + "type: " + this.type + " available: " + this.available;
		}
	}

	// converts [x,y] coordinates to string representation "x,y"
	function coordinatesToString(coordinates) {
		var x = coordinates[0];
		var y = coordinates[1];
		return  x + ',' + y;
	}

});