
/* This will hand all of the drawing for the application. Including:
	-- Hexagons for the land
	-- Logic for piecing together the tiles
	-- Placement of Settlements, Cities, and Roads
	-- Moving the Robber
    -- Keep track of Map State.
        -- Use a Graph for storing hex verticies and edges. 
*/

angular.module('expeditionApp')
.service('MapService', ['GameService', 'MapGraphService', function(GameService, MapGraphService) {
	const COLOR_LOOKUP = {sheep : "#2eaa30", ore : "#bbbcb5", brick : "#842121", wood : "#663f1f", wheat : "#c4bb19"}

	// Constants used for drawing game board
    const HEX_WIDTH = 160;
    const HEX_HEIGHT = 160;
    const BASE_X_OFFSET = 0;
    const BASE_Y_OFFSET = 0;
    const ROW_OFFSET = (HEX_WIDTH / 2);
    const MID_ROW_IDX = 2;
    const VERT_GAP_CLOSE = 40; //HEX_HEIGHT / 3.4;
    

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

    // This function adds all verticies found in the parameter lands matrix
    this.addAllVerticiesInHexToGraph = function (hexCoordinates) {
        for (var coordLabel in hexCoordinates) {
            if (hexCoordinates.hasOwnProperty(coordLabel)) {
                console.log("Adding vertex: " + coordLabel + ": " + hexCoordinates[coordLabel]);
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

    /* ---------------------------- Drawing Logic --------------------------- */
    this.drawRoad = function () {
        /*var c = document.getElementById("land10");
        var ctx = c.getContext("2d");
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#000000";

        console.log("drawing road... from: x: " + road.from[0] + " y: " + road.from[1]);
        console.log("to: x: " + road.to[0] + " y: " + road.to[1]);
        ctx.beginPath();
        ctx.moveTo(80, 0);
        ctx.lineTo(160, 40);
        ctx.closePath();
        ctx.stroke();*/
    }

    this.createGameBoard = function () {
        // Draw the board row by row
        var numRows = GameService.landsMatrix.length;
        for (var row = 0; row < numRows; row++) {
            this.createRow(row);
        }
    };

    // Row number can be from 0 to 4
    this.createRow = function (rowNumber) {
        var nHexes = GameService.NUM_HEXES_IN_ROW[rowNumber];
        for (var i = 0; i < nHexes; i++) {
            this.createNewHex(rowNumber, i);
        }
    };

    this.createNewHex = function (rowNum, colNum) {
        // Draw the land
        var land = GameService.landsMatrix[rowNum][colNum];
        
        // Apply necessary offsets to get land into place.
        // Each row has different offsets from the left. 
        var xOffset = 0, yOffset = 0;
        xOffset = Math.abs(MID_ROW_IDX - rowNum) * ROW_OFFSET;
        // Additionally, shift left by hexagon's height * column
        xOffset += (HEX_WIDTH * colNum);
        // Shift down by hexagon's height * row
        yOffset = (HEX_HEIGHT - VERT_GAP_CLOSE) * rowNum;

        // This informatiom will be saved into the land object itself for later use
        // in adding buildings and roads.
        console.log("landID from drawNexHex(): " + land.landID + "xOffset: " + xOffset);

        /* This information is used by the MapGraph algorithms for uniquely identifying 
        verticies. It aides with retrieving and placing settlements, cities, and roads.
        This infomration is necessary to make a graph implementation work because verticies
        are not unique - multiple lands may share the same vertex. Alternamtive implementation 
        can be to store a mapping from shared points into one vertex id... */
        var hexCoordinates = {
            A: [80 + xOffset, 0 + yOffset],
            B: [160 + xOffset, 40 + yOffset],
            C: [160 + xOffset, 120 + yOffset],
            D: [80 + xOffset, 160 + yOffset],
            E: [0 + xOffset, 120 + yOffset],
            F: [0 + xOffset, 40 + yOffset]
        };
        land.coordinates = hexCoordinates;

        // Store hex coordinates as verticies and edges in graph
        this.addAllVerticiesInHexToGraph(hexCoordinates);  // This must occur before adding edges
        this.addAllEdgesFromHexToGraph(hexCoordinates);

        // Draw hexagon onto game board
        drawHex(land, xOffset, yOffset);

        console.log("number of verticies: ", MapGraphService.getNumVerticies());
        // DRAW DICE NUMBER WITH CANVAS

    };

    function drawHex(land, xOffset, yOffset) {
        // Grab game container
        var gameContainer = document.getElementById("gameBoardContainer");

        // Create canvas element to contain new land
        var c = document.createElement("canvas");
        c.id = land.landID;
        c.width = HEX_WIDTH;
        c.height = HEX_HEIGHT;
        //c.style.position = "absolute";
        c.style.left = xOffset + "px";
        c.style.top = yOffset + "px";

        // Grab context
        var ctx = c.getContext("2d");
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "#fff328";
        ctx.fillStyle = COLOR_LOOKUP[land.type];

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

        // Add handler for click
        c.addEventListener("click", function (event) {
            console.log(GameService.landsDictionary[event.target.id]);
            var landClicked = event.target.id;

        });

        gameContainer.appendChild(c);
    }

}]);