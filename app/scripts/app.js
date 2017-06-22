/**
 * Created by johnlu on 3/3/17.
 */
'use strict'

angular.module('expeditionApp', ['ui.router', 'ngAnimate'])


.config( function ($stateProvider) {

	$stateProvider
	.state('startMenu', {
		url: '',
		templateUrl: 'views/startMenu.html',
		controller: 'StartMenuController' 


	})
	.state('play', {
		url: '/play',
		templateUrl: 'views/main.html',
		controller: 'GameController'
	})
})
;