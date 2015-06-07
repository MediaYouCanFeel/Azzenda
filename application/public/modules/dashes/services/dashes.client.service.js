'use strict';

//Dashes service used to communicate Dashes REST endpoints
angular.module('dashes').factory('Dashes', ['$resource',
	function($resource) {
		return $resource('dashes/:dashId', { dashId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);