'use strict';

//Setting up route
angular.module('tasks').config(['$stateProvider',
	function($stateProvider) {
		// Tasks state routing
		$stateProvider.
		state('create-task-proj', {
			url: '/create-task-proj',
			templateUrl: 'modules/tasks/views/create-task-proj.client.view.html'
		}).
		state('update-status', {
			url: '/update-status',
			templateUrl: 'modules/tasks/views/update-status.client.view.html'
		}).
		state('create-subtask', {
			url: '/create-subtask',
			templateUrl: 'modules/tasks/views/create-subtask.client.view.html'
		}).
		state('listTasks', {
			url: '/tasks',
			templateUrl: 'modules/tasks/views/list-tasks.client.view.html'
		}).
		state('createTask', {
			url: '/tasks/create',
			templateUrl: 'modules/tasks/views/create-task.client.view.html'
		}).
		state('viewTask', {
			url: '/tasks/:taskId',
			templateUrl: 'modules/tasks/views/view-task.client.view.html'
		}).
		state('editTask', {
			url: '/tasks/:taskId/edit',
			templateUrl: 'modules/tasks/views/edit-task.client.view.html'
		});
	}
]);