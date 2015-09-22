'use strict';

//Setting up route
angular.module('splashes').config(['$stateProvider',
	function($stateProvider) {
		// Splashes state routing
		$stateProvider.
		state('listSplashes', {
			url: '/splashes',
			templateUrl: 'modules/splashes/views/list-splashes.client.view.html'
		}).
		state('createSplash', {
			url: '/splashes/create',
			templateUrl: 'modules/splashes/views/create-splash.client.view.html'
		}).
		state('viewSplash', {
			url: '/splashes/:splashId',
			templateUrl: 'modules/splashes/views/view-splash.client.view.html'
		}).
		state('editSplash', {
			url: '/splashes/:splashId/edit',
			templateUrl: 'modules/splashes/views/edit-splash.client.view.html'
		});
	}
]);