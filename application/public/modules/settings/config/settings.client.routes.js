'use strict';

//Setting up route
angular.module('settings').config(['$stateProvider',
	function($stateProvider) {
		// Settings state routing
		$stateProvider.
		state('listSettings', {
			url: '/settings',
			templateUrl: 'modules/settings/views/list-settings.client.view.html'
		}).
		state('createSetting', {
			url: '/settings/create',
			templateUrl: 'modules/settings/views/create-setting.client.view.html'
		}).
		state('viewSetting', {
			url: '/settings/:settingId',
			templateUrl: 'modules/settings/views/view-setting.client.view.html'
		}).
		state('editSetting', {
			url: '/settings/:settingId/edit',
			templateUrl: 'modules/settings/views/edit-setting.client.view.html'
		});
	}
]);