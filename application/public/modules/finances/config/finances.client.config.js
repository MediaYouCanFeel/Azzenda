'use strict';

// Configuring the Articles module
angular.module('finances').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Finances', 'finances', 'dropdown', '/finances(/create)?');
		Menus.addSubMenuItem('topbar', 'finances', 'List Finances', 'finances');
		Menus.addSubMenuItem('topbar', 'finances', 'New Finance', 'finances/create');
	}
]);