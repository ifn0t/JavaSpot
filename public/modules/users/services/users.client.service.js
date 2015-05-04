'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('listRecipesService', ['$resource',
	function($resource) {
		return $resource('recipes', {}, {
			list: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);