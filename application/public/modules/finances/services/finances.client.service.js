'use strict';

//Finances service used to communicate Finances REST endpoints
angular.module('finances').factory('Finances', ['$resource',
	function($resource) {
		return $resource('finances/:financeId', { financeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);