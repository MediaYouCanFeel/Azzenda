'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('Events', ['$resource',
	function($resource) {
		return $resource('events/:eventId', {eventId: '@_id'}, {
			query: {
				method: 'PUT',
				isArray: true
			},
			update: {
                method: 'PUT'
            },
            getTypes: {
                method: 'GET',
                url: 'events/create/types',
                isArray: true
            },
            addType: {
                method: 'POST',
                url: 'events/create/types'
            },
            updateType: {
                method: 'PUT',
                url: 'events/create/types/:eventTypeId',
                params: {eventTypeId: '@_id'}
            }, 
            getLocs: {
                method: 'GET',
                url: 'events/create/locations',
                isArray: true
            },
            rsvp: {
            	method: 'PUT',
            	url: 'events/update/rsvp/:eventId',
            	params: {eventId: '@_id'}
            }
		});
	}
]);