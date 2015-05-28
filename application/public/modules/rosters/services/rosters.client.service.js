'use strict';

//Rosters service used to communicate Rosters REST endpoints
angular.module('rosters').factory('Rosters', ['$resource',
	function($resource) {
		return $resource('rosters/:rosterId', { rosterId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);