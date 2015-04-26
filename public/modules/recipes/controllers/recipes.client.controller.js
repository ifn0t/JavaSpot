'use strict';

// added http.
// Recipes controller
angular.module('recipes')
.controller('RecipesController', [
	'$scope', 
	'$stateParams',
	'$http',
	'$location',
	'Authentication', 
	'Recipes',

	function($scope, $stateParams, $http, $location, Authentication, Recipes) {

		$scope.authentication = Authentication;

		$scope.likes = 0;
		$scope.isLiked = false;


		// Create new Recipe
		// ----------------------
		$scope.create = function() {

			// Create new Recipe object
			var recipe = new Recipes ({
				name:  	this.name,
			});

			recipe.$save(function(response) {

				// redirect to this newly created recipe
				$location.path('recipes/' + response._id);

				// Clear form fields,
				$scope.name 		= '';
				$scope.image 		= '';
				$scope.honey		= false;	// boolean
				$scope.description	= '';

				// error output.
			}, function(errorResponse) {
				console.log('error on client.recipe.contrllr.creat-function');
				$scope.error = errorResponse.data.message;
			});
		};

		// 
		// `Like` recipe function


		$scope.likeThis = function() {
			// incremnnt likes
			// $scope.recipe.likes += 1;	
			// grab photo
			var recipe = $scope.recipe;

			console.log('likeThis has been called.');


			// old way - 2nd commit - d59ad

			// recipe.$update(function(){

			// 	$location.path('recipes/' + recipe._id);
			// }, function(errorResponse){
			// 	$scope.error = errorResponse.data.message;
			// });

			// use a http req, put for update function in CRUD.
			$http.put('recipes/like/' + recipe._id).success(function() {

				// update `recipe` w/ user ID
				recipe.likes.push($scope.authentication.user._id);

				// this scope decares
				// that this user likes the
				// recipe w/in the scope./?
				$scope.isLiked=true;
			});
		};

		// 
		// Remove existing Recipe

		$scope.remove = function(recipe) {
			if ( recipe ) { 
				recipe.$remove();

				for (var i in $scope.recipes) {
					if ($scope.recipes [i] === recipe) {
						$scope.recipes.splice(i, 1);
					}
				}
			} else {
				$scope.recipe.$remove(function() {
					$location.path('recipes');
				});
			}
		};

		// 
		// using d3 and custom direcive here
		// 

		//
		// Update existing Recipe --same

		$scope.update = function() {

			var recipe = $scope.recipe;

			recipe.$update(function() {

				$location.path('recipes/' + recipe._id);

			}, function(errorResponse) {

				console.log('err0or in client/recipe/cntrller/update-function. \n\n\n\n');

				$scope.error = errorResponse.data.message;
			});
		};

		//
		// Find a list of Recipes 	--same
		// 

		$scope.find = function() {
			$scope.recipes = Recipes.query();
		};


		// 
		// Find existing Recipe
		// 


		$scope.findOne = function() {
			// $scope.recipe = Recipes.get({ 
			// 	recipeId: $stateParams.recipeId
			// });

			console.log('Finding one : ' + $stateParams.recipeId);

			// get our recipe and do something
			$scope.recipe = Recipes.get({

			// grab id
			recipeId: 	$stateParams.recipeId

			}, function() {
				// on success log
				console.log('recipe found!\n');

				// grab user to make sure authenticated user
				var user = $scope.authentication.user;
				// initially to false 
				var containsValue = false;

				// log user id
				console.log('ID ' + $scope.authentication.user._id);

				// grab amount of likes for recipe, in scope
				$scope.likes = $scope.recipe.likes.length;

				// chceck something....
				for (var i = 0; i < $scope.recipe.likes.length; i++ ) {

					// long console so just grabbed.
	                console.log('Comparing ' + $scope.recipe.likes[i] + ' to ' + user._id + ' is ' + ($scope.recipe.likes[i]===user._id).toString());

					// conditional
					if ($scope.recipe.likes[i]===user._id) {
						containsValue = true;
					}
				}
				// sets to true.
				$scope.isLiked = containsValue;
			});
		};
}]);