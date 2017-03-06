/**
 * Created by johnlu on 3/4/17.
 */

angular.module('expeditionApp')
.factory('LandFactory', function() {

    var landFactory = {};
    // Each land must keep track of it's state.
    landFactory.createLand = function(type) {
        var newLand = {};
        newLand.type = type;
        newLand.diceNumber = -1;
        // Note: the newLandID uniquely determines the location.
        newLand.landID = "";

        // State information
        newLand.hasRobber = false;
        newLand.owners = [];
        newLand.occupiedCorners = [];  // 0 to 6. 0 is north corner. Count counterclockwise
        newLand.occupiedEdges = [];    // 'N', 'NE', 'NW', 'S', 'SE', 'SW'

        return newLand;
    }

    // Other factory methods


    return landFactory;
});