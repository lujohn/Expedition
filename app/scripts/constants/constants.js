angular.module('expeditionApp')
.constant('LANDHEX', {
	'WIDTH': 160,
	'HEIGHT': 160,
	'SHIFT_BOARD_X': -80
})
.constant('Harbors', {
	// Key: landID, Value: Harbor corners
	'locations': {
		'land0': 'F-A',
		'land1': 'A-B',
		'land3': 'E-F',
		'land6': 'A-B',
		'land11': 'B-C',
		'land12': 'E-F',
		'land15': 'C-D',
		'land16': 'D-E',
		'land17': 'C-D'
	}
});