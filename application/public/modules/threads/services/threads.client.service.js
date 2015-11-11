'use strict';

//Threads service used to communicate Threads REST endpoints
angular.module('threads').factory('Threads', ['$resource',
	function($resource) {
		return $resource('threads/:threadId', { threadId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);