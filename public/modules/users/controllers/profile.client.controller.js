'use strict';

angular.module('users').controller('ProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {

		$scope.user = Authentication.user;

		console.log('/n/n scope.user in profile is: ', $scope.user);


		

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// add function to find.me for user json.
		// $scope.me = function(user) {
		// 	console.log('scope.me called');
		// };

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};
	}
]);