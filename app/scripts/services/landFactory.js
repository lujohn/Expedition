
/* NOTE: Store the points of the hex tiles for easier implmentation of Settlements and Roads */

angular.module('expeditionApp')
.factory('LandFactory', function() {

    var landFactory = {};
    this.landCount = 0;

    landFactory.createLand = function(type) {
        var newLand = {};
        newLand.type = type;
        newLand.diceNumber = -1;
        newLand.landID = "land" + this.landCount;  // landID uniquely determines the land.
        newLand.coordinates = {}; 
        newLand.hasRobber = false;
        // Coordinates of harbors belonging to this land (if exists). E.g. ['160,80', '0,80'].
        // harborCoords is set in MapService.initializeGraph()
        newLand.harborCoord = [];
        newLand.harborType = null;

        this.landCount++;

        newLand.toString = function () {
            return newLand.type;
        }
        return newLand;
    }

    return landFactory;
});