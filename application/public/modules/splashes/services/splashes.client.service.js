'use strict';

//Splashes service used to communicate Splashes REST endpoints
angular.module('splashes').factory('Splashes', ['$resource',
	function($resource) {
		return $resource('splashes/:splashId', { splashId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);