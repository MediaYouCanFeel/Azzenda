'use strict';

// Configuring the Articles module
angular.module('settings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Settings', 'settings', 'dropdown', '/settings(/create)?');
		Menus.addSubMenuItem('topbar', 'settings', 'List Settings', 'settings');
		Menus.addSubMenuItem('topbar', 'settings', 'New Setting', 'settings/create');
	}
]);