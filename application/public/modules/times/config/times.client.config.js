'use strict';

// Configuring the Articles module
angular.module('times').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Times', 'times', 'dropdown', '/times(/create)?');
		Menus.addSubMenuItem('topbar', 'times', 'List Times', 'times');
		Menus.addSubMenuItem('topbar', 'times', 'New Time', 'times/create');
	}
]);