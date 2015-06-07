'use strict';

//Setting up route
angular.module('dashes').config(['$stateProvider',
	function($stateProvider) {
		// Dashes state routing
		$stateProvider.
		state('listDashes', {
			url: '/dash',
			templateUrl: 'modules/dashes/views/list-dashes.client.view.html'
		}).
		state('createDash', {
			url: '/dashes/create',
			templateUrl: 'modules/dashes/views/create-dash.client.view.html'
		}).
		state('viewDash', {
			url: '/dashes/:dashId',
			templateUrl: 'modules/dashes/views/view-dash.client.view.html'
		}).
		state('editDash', {
			url: '/dashes/:dashId/edit',
			templateUrl: 'modules/dashes/views/edit-dash.client.view.html'
		});
	}
]);