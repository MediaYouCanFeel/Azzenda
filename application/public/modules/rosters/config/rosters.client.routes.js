'use strict';

//Setting up route
angular.module('rosters').config(['$stateProvider',
	function($stateProvider) {
		// Rosters state routing
		$stateProvider.
		state('listRosters', {
			url: '/rosters',
			templateUrl: 'modules/rosters/views/list-rosters.client.view.html'
		}).
		state('createRoster', {
			url: '/rosters/create',
			templateUrl: 'modules/rosters/views/create-roster.client.view.html'
		}).
		state('viewRoster', {
			url: '/rosters/:rosterId',
			templateUrl: 'modules/rosters/views/view-roster.client.view.html'
		}).
		state('editRoster', {
			url: '/rosters/:rosterId/edit',
			templateUrl: 'modules/rosters/views/edit-roster.client.view.html'
		});
	}
]);