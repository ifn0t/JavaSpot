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
				$scope.espressoShots	= 0;
				$scope.decaf		= false;
				$scope.dairy		= '';
				$scope.syrup		= '';
				$scope.sugar		= 0;

				// error output.
			}, function(errorResponse) {
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
				console.log('recipe found!\n' + $scope.recipe.name);

				// grab user to make sure authenticated user
				var user = $scope.authentication.user;
				// initially to false 
				var containsValue = false;

				// log user id
				console.log('ID ' + $scope.authentication.user._id);

				// fl-oz.
				/*var fullCup = 16,
					emptyCup = 0,
					sugarUnit = 0.5,
					syrupUnit = 0.75,
					espressoUnit = 1;

					// init values.
				var totalEspressoVol = 0,
					totalSugarVol = 0;
					// totalSyrupVol = 0;

				// total = espresspoShots * 1 oz.
				totalEspressoVol = $scope.recipe.espressoShots * espressoUnit;

				console.log('total espresso volumn is: '+ totalExpressoVol);

				// add to empty cup
				emptyCup += totalExpressoVol;

				// add syrup if not none, a flat rate of .75
				if (!$scope.recipe.syrup === 'none' ) {
					// logs choosen syrup name
					console.log('we added this syrup: '+ $scope.recipe.syrup);
					// add to empty cup
					emptyCup += syrupUnit;
					console.log('empty cup is at: ' + emptyCup);
				}

				if (!$scope.recipe.sugar === 0) {
					totalSugarVol = $scope.recipe.sugar * sugarUnit;
					console.log('total sugar volumn is: ' + totalSugarVol);
					emptyCup += totalSugarVol;
					console.log('empty cup is at: ' + emptyCup);
				}

				// the rest is amount of dairy product
				var dairyVol = fullCup - emptyCup;*/






				/*$scope.data = [
					{
						name: $scope.recipe.syrup,
						score: totalSyrupVol			// should by .75 if syrup was choosen
					},
					{
						name: 'Expresso Shots',
						score: $scope.recipe.espressoShots
					},
					{
						name: $scope.recipe.dairy,
						score: totalSyrupVol
					},
					{
						name: $scope.recipe.syrup,
						score: totalSyrupVol
					}
				];*/

				// grab amount of likes for recipe, in scope
				$scope.likes = $scope.recipe.likes.length;

				// chceck something....
				for (var i = 0; i < $scope.recipe.likes.length; i++ ) {

					// long console so just grabbed.
	                // console.log('Comparing ' + $scope.recipe.likes[i] + ' to ' + user._id + ' is ' + ($scope.recipe.likes[i]===user._id).toString());

					// conditional
					if ($scope.recipe.likes[i]===user._id) {
						containsValue = true;
					}
				}
				// sets to true.
				$scope.isLiked = containsValue;
			});
		};
}])
.directive('d3Bars', ['$window', '$timeout', 'd3Service', 
	function($window, $timeout, d3Service) {
		return {
		restrict: 'EA',
		scope: {},
		link: function(scope, element, attrs) {
			d3Service.d3().then(function(d3) {
				// raw d3 object here.

				var margin = parseInt(attrs.margin) || 20,
			        barHeight = parseInt(attrs.barHeight) || 20,
			        barPadding = parseInt(attrs.barPadding) || 5;


				// select specif class?
				var svg = d3.select(element[0])	// this goes through
					.append('svg')
					.style('width', '100%');


				// Browser onresize event
		          window.onresize = function() {
		            scope.$apply();
		          };

		          // hard-code data
		          // 
		          // this is where we need to grab user data...
		          scope.data = [
		            {name: 'Greg', score: 20},
		            {name: 'Ari', score: 96},
		            {name: 'Q', score: 50},
		            {name: 'Loser', score: 48}
		          ];

		          // Watch for resize event
		          scope.$watch(function() {
		            return angular.element($window)[0].innerWidth;
		          }, function() {
		            scope.render(scope.data);
		          });

		          scope.render = function(data) {
		            // our custom d3 code

		            svg.selectAll('*').remove();


		            if (!data) {
		            	return;
		            }

		            var width = d3.select(element[0]).node().offsetWidth - margin;
		            var	height = scope.data.length * (barHeight + barPadding);
		            // var	color = d3.color.category20();
		            var	xScale = d3.scale.linear()
		            		.domain([0, d3.max(data, function(d) {
		            			return d.score;
		            		})])
		            		.range([0, width]);


		          svg.attr('height', height);


		          svg.selectAll('rect')
		          	.data(data).enter()
		          		.append('rect')
		          		.attr('height', barHeight)
		          		.attr('width', 40)
		          		.attr('x', Math.round(margin/2))
		          		.attr('y', function(d,i) {
		          			return i * (barHeight + barPadding);
		          		});
		          		// .attr('fill', function(d) {
		          		// 	return color(d.score);
		          		// })
		          		// .transistion()
		          		// 	.duration(1000)
		          		// 	.attr('width', function(d) {
		          		// 		return xScale(d.score);
		          		// 	});

		          };

			});
		}
	};
}]);










//eod