
/* This will hand all of the drawing for the application. Including:
	-- Hexagons for the land
	-- Logic for piecing together the tiles
	-- Placement of Settlements, Cities, and Roads
	-- Moving the Robber
    -- Keep track of Map State.
        -- Use a Graph for storing hex verticies and edges. 
*/

angular.module('expeditionApp')
.service('MapService', ['MapGraphService', function(MapGraphService) {
	
	// Constants used for calculating hex coordinates
    const HEX_WIDTH = 160;
    const HEX_HEIGHT = 160;
    const ROW_OFFSET = (HEX_WIDTH / 2);
    const MID_ROW_IDX = 2;
    const VERT_GAP_CLOSE = 40; 

    // This function must be called before using MapService.
    this.initializeGraph = function (lands) {
        var xOffset = 0; var yOffset = 0;
        for (var i = 0; i < lands.length; i++) {
            var row = lands[i];
            for (var j = 0; j < row.length; j++) {
                xOffset = Math.abs(MID_ROW_IDX - i) * ROW_OFFSET;
                xOffset += (HEX_WIDTH * j);  // Additionally, shift left by hexagon's height * column
                
                // Shift down by hexagon's height * row
                yOffset = (HEX_HEIGHT - VERT_GAP_CLOSE) * i;

                /* This information is used by the MapGraph algorithms for uniquely identifying 
                verticies. It aides with retrieving and placing settlements, cities, and roads.
                This infomration is necessary to make a graph implementation work since verticies
                are not unique. That is, multiple lands may share the same vertex. 
                Alternative implementation can be to store a mapping from shared points into one vertex id. */
                var hexCoordinates = {
                    A: [80 + xOffset, 0 + yOffset],
                    B: [160 + xOffset, 40 + yOffset],
                    C: [160 + xOffset, 120 + yOffset],
                    D: [80 + xOffset, 160 + yOffset],
                    E: [0 + xOffset, 120 + yOffset],
                    F: [0 + xOffset, 40 + yOffset] 
                };
                var land = lands[i][j];
                land.coordinates = hexCoordinates;

                // Set up the MapGraph for use
                this.addAllVerticiesInHexToGraph(hexCoordinates);
                this.addAllEdgesFromHexToGraph(hexCoordinates);
                this.registerLandWithVerticies(land);
            }
        }
    }

    // This function adds all verticies found in the parameter lands matrix
    this.addAllVerticiesInHexToGraph = function (hexCoordinates) {
        for (var coordLabel in hexCoordinates) {
            if (hexCoordinates.hasOwnProperty(coordLabel)) {
                var coord = hexCoordinates[coordLabel];  // coordLabel is A, B, C . . . or F
                MapGraphService.addVertex(coord);  // coord is [x,y] coordinates
            }
        }
    }

    // This function forms edges out of all hexagonal points and adds them to the
    // map graph. That is, every hexagon will generate 6 edges and be added to the
    // graph. However, duplicate edges will not be added. NOTE: verticies must 
    // be added BEFORE this function is called - this implementation can be changed.
    this.addAllEdgesFromHexToGraph = function (hexCoordinates) {
        var coordLabels = Object.keys(hexCoordinates);
        for (var i = 0; i < coordLabels.length - 1; i++) {
            var v1 = hexCoordinates[coordLabels[i]];
            var v2 = hexCoordinates[coordLabels[i+1]];
            MapGraphService.addEdge(null, v1, v2);
        }
        // Add coordinate F to coordinate A
        var v1 = hexCoordinates[coordLabels[coordLabels.length - 1]];
        var v2 = hexCoordinates[coordLabels[0]];
        MapGraphService.addEdge(null, v1, v2);
    }

    this.registerLandWithVerticies = function (land) {
        // For each of the land's corners, register the land as belonging to the vertex (corner)
        // in the graph.
        var hexCoords = land.coordinates;
        for (var corner in hexCoords) {
            if (hexCoords.hasOwnProperty(corner)) {
                var cornerCoord = hexCoords[corner];
                MapGraphService.registerLandToVertex(land, cornerCoord);
            }
        }
    }

    /* ---------------------- Interaction with MapGraphService ----------------------- */
    this.addRoadToGraph = function (road) {
        MapGraphService.setEdge(road.color, road.from, road.to);
    }

    this.addBuildingToGraph = function (building) {
        MapGraphService.setVertex(building.color, building.type, building.location);
    }

    // Checks if a road has already been built at the specified location
    this.roadExistsAt = function (from, to) {
        // Edge color initlized to null. Changed when road is built
        return MapGraphService.getEdgeColor(from, to) != null;
    }

    this.buildingExistsAt = function (coord) {
        // vertex.type is initialized to null and changed when settlement is built.
        var vertex = MapGraphService.getVertex(coord);
        return vertex.type != null;
    }

    this.getBuildingColor = function (coord) {
        var vertex = MapGraphService.getVertex(coord);
        return vertex.color;
    }

    // This function returns a set of adjacent buildings (just the color) to the given coordinates
    this.getAdjacentBuildings = function (coord) {
        var adjVerticies = MapGraphService.getAdjacentVerticies(coord);
        var adjBuildings = []
        adjVerticies.forEach( function (vertex) {
            if (!vertex.available) {
                adjBuildings.push(vertex.color);
            }
        });
        return adjBuildings;
    }

    // This function returns all roads (color only) with the given source
    this.getRoadsWithSource = function (coord) {

        var edgesForCoord = MapGraphService.getEdges(coord);
        var roads = [];
        for (var toCoordStr in edgesForCoord) {
            if (edgesForCoord.hasOwnProperty(toCoordStr)) {
                console.log("found road at: " + coord + " with color: " + edgesForCoord[toCoordStr])
                roads.push(edgesForCoord[toCoordStr]);
            }
        }
        return roads;
    }

    // This function returns the lands associated with the given coordinates. Used mainly for 
    // incrementing the resources in player's hands
    this.getLandsForCoordinates = function (coord) {
        return MapGraphService.getVertex(coord).lands;
    }

    this.getNumVerticies = function () {
        return MapGraphService.getNumVerticies();
    }
}]);