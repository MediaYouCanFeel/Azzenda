'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Events state routing
		$stateProvider.
		state('schedule-input', {
			url: '/schedule-input',
			templateUrl: 'modules/events/views/schedule-input.client.view.html'
		}).
		state('create-event-type', {
			url: '/events/createEventType',
			templateUrl: 'modules/events/views/create-event-type.client.view.html'
		}).
		state('listEvents', {
			url: '/events',
			templateUrl: 'modules/events/views/list-events.client.view.html'
		}).
		state('createEvent', {
			url: '/events/create',
			templateUrl: 'modules/events/views/create-event.client.view.html'
		}).
		state('viewEvent', {
			url: '/events/:eventId',
			templateUrl: 'modules/events/views/view-event.client.view.html'
		}).
		state('editEvent', {
			url: '/events/:eventId/edit',
			templateUrl: 'modules/events/views/edit-event.client.view.html'
		}).
        state('dateTimeModalEvent', {
			url: '/events/create/dateTimeModal',
			templateUrl: 'modules/events/views/calendar-modal-event.client.view.html'
		});
	}
]);