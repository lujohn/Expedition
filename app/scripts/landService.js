/**
 * Created by johnlu on 3/4/17.
 */

angular.module('expeditionApp')
    .service('landService', function() {

    // Each land must keep track of it's state.
    this.createLand = function(type) {

        this.type = type;
        this.diceNumber = -1;
        // Note: the landID uniquely determines the location.
        this.landID = -1;

        // State information
        this.hasRobber = false;
        this.owners = [];
        this.occupiedCorners = [];  // 0 to 6. 0 is north corner. Count counterclockwise
        this.occupiedEdges = [];    // 'N', 'NE', 'NW', 'S', 'SE', 'SW'
    }
});