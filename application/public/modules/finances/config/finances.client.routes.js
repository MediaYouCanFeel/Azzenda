'use strict';

//Setting up route
angular.module('finances').config(['$stateProvider',
	function($stateProvider) {
		// Finances state routing
		$stateProvider.
		state('listFinances', {
			url: '/finances',
			templateUrl: 'modules/finances/views/list-finances.client.view.html'
		}).
		state('createFinance', {
			url: '/finances/create',
			templateUrl: 'modules/finances/views/create-finance.client.view.html'
		}).
		state('viewFinance', {
			url: '/finances/:financeId',
			templateUrl: 'modules/finances/views/view-finance.client.view.html'
		}).
		state('editFinance', {
			url: '/finances/:financeId/edit',
			templateUrl: 'modules/finances/views/edit-finance.client.view.html'
		});
	}
]);