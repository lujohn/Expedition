
/* NOTE: Store the points of the hex tiles for easier implmentation of Settlements and Roads */

angular.module('expeditionApp')
.factory('LandFactory', function() {

    var landFactory = {};
    this.landCount = 0;

    landFactory.createLand = function(type) {
        var newLand = {};
        newLand.type = type;
        newLand.diceNumber = -1;
        // Note: the newLandID uniquely determines the location.
        newLand.landID = "land" + this.landCount;

        newLand.coordinates = {}; 

        // State information
        newLand.hasRobber = false;
        newLand.occupiedCorners = {
        };  // 0 to 6. 0 is north corner. Count counterclockwise
        newLand.occupiedEdges = {
        };    // 'N', 'NE', 'NW', 'S', 'SE', 'SW'

        this.landCount++;
        return newLand;
    }

    // Other factory methods


    return landFactory;
});