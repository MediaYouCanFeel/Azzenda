'use strict';

angular.module('events').filter('persEvent', [
	function() {
		return function(items, status) {
			var noPersonal = [];
			console.log("INPUT: " + items);
			
			for (var inp in items) {
				console.log(inp.status);
			}
			
			// Pers event directive logic
			// ...

			return items;
		};
	}
]);