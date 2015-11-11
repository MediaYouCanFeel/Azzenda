'use strict';

//Setting up route
angular.module('threads').config(['$stateProvider',
	function($stateProvider) {
		// Threads state routing
		$stateProvider.
		state('listThreads', {
			url: '/threads',
			templateUrl: 'modules/threads/views/list-threads.client.view.html'
		}).
		state('createThread', {
			url: '/threads/create',
			templateUrl: 'modules/threads/views/create-thread.client.view.html'
		}).
		state('viewThread', {
			url: '/threads/:threadId',
			templateUrl: 'modules/threads/views/view-thread.client.view.html'
		}).
		state('editThread', {
			url: '/threads/:threadId/edit',
			templateUrl: 'modules/threads/views/edit-thread.client.view.html'
		});
	}
]);