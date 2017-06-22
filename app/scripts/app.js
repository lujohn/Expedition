/**
 * Created by johnlu on 3/3/17.
 */
'use strict'

angular.module('expeditionApp', ['ui.router'])


.config( function ($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('startMenu', {
		url: '/',
		templateUrl: 'views/startMenu.html',
		controller: 'StartMenuController' 


	})
	.state('play', {
		url: '/play',
		templateUrl: 'views/main.html',
		controller: 'GameController'
	})

	$urlRouterProvider.otherwise('/');
})
;