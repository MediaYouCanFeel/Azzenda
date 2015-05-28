'use strict';

// Configuring the Articles module
angular.module('rosters').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rosters', 'rosters', 'dropdown', '/rosters(/create)?');
		Menus.addSubMenuItem('topbar', 'rosters', 'List Rosters', 'rosters');
		Menus.addSubMenuItem('topbar', 'rosters', 'New Roster', 'rosters/create');
	}
]);