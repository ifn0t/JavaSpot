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


		// $scope.recipeData = [
		// 			{
		// 				name: 'expresso shots',
		// 				value: 80
		// 			},
		// 			{
		// 				name: 'syrup',
		// 				value: 90
		// 			},
		// 			{
		// 				name: 'sugar',
		// 				value: 40
		// 			},
		// 			{
		// 				name: 'dairy',
		// 				value: 70
		// 			}
		// 		];

		$scope.find = function() {
			$scope.recipes = Recipes.query();
		};


		// 
		// Find existing Recipe
		// 


		
		$scope.data = [
			{
				name: 'expresso shots',
				value: 88
			},
			{
				name: 'syrup',
				value: 99
			},
			{
				name: 'sugar',
				value: 77
			},
			{
				name: 'dairy',
				value: 55
			}
		];


		$scope.findOne = function() {
			// $scope.recipe = Recipes.get({ 
			// 	recipeId: $stateParams.recipeId
			// });

			console.log('Finding one : ' + $stateParams.recipeId);
			console.log($scope.data);
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
				// var fullCup = 16,
				// 	emptyCup = 0,
				// 	sugarUnit = 0.5,
				// 	syrupUnit = 0.75,
				// 	espressoUnit = 1;


				// var totalEsp = espressoUnit * $scope.recipe.espressoShots;
				// console.log('total amt of espresso is : ' , totalEsp);


				// var totalSyrup;

				// if ($scope.recipe.syrup) {
					// console.log('user has choosen a syrup : ', $scope.recipe.syrup);
					// totalSyrup += 0.75;
				// }

				// var totalSugar;

				// if ($scope.recipe.sugar) {
				// 	console.log('user has choosen sugar: ' , $scope.recipe.sugar);
				// 	totalSugar = $scope.recipe.sugar * sugarUnit;
				// }

				// all the ingredient - cup volumn should be dairy/froth.
				// using a 16 fl-oz based cupe.

				// var totalDairy = fullCup - (totalSugar + totalEsp + totalSyrup);

				// $scope.recipeData = [
				// 	{
				// 		name: 'expresso shots',
				// 		value: 80
				// 	},
				// 	{
				// 		name: 'syrup',
				// 		value: 90
				// 	},
				// 	{
				// 		name: 'sugar',
				// 		value: 40
				// 	},
				// 	{
				// 		name: 'dairy',
				// 		value: 70
				// 	}
				// ];
				// console.log('$scope.recipeData ' +  $scope.recipeData);




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
			scope: {
				data: '='
			},
			link: function(scope, elem, attrs) {
				// load d3 then pass intot this function.
				d3Service.d3().then(function(d3) {

				// grab data from attribute.
				var theDataToPlot= scope.data;
				console.log('the data is \n\n\n' + theDataToPlot[0].value);

				console.log('length of this array is: ' , theDataToPlot.length);

				var someData = [];

				console.log('someData: ' , someData);

				var margin = parseInt(attrs.margin) || 20,
			        barHeight = parseInt(attrs.barHeight) || 20,
			        barPadding = parseInt(attrs.barPadding) || 5;

				var svg = d3.select(elem[0])	// this goes through
					.append('svg')
					.style('width', '100%');





				// Browser onresize event
		          // window.onresize = function() {
		            // scope.$apply();
		          // };

		          // hard-code data
		          // 
		          // this is where we need to grab user data...
		          // scope.data = [
		          //   {
		          //   	name: 'Greg', 
		          //   	score: 20
		          //   },
		          //   {
		          //   	name: 'Ari', 
		          //   	score: 96
		          //   },
		          //   {
		          //   	name: 'Q', 
		          //   	score: 50
		          //   },
		          //   {
		          //   	name: 'Loser', 
		          //   	score: 48
		          //   }
		          // ];

		          // Watch for resize event
//		          scope.$watch(function() {
//		           return elem($window)[0].innerWidth;
//		          }, function() {
//		            scope.render(theDataToPlot);
//		          });

	        scope.render = function(data) {
	            // our custom d3 code
	            console.log('incoming data for d3',data);
	            svg.selectAll('*').remove();


	            if (!data) {
	            	return;
	            }

		            var width = d3.select(elem[0]).node().offsetWidth - margin;
		            var	height = scope.data.length * (barHeight + barPadding);
		            // var	color = d3.color.category20();
		            var	xScale = d3.scale.linear()
		            		.domain([0, d3.max(data, function(d) {
		            			return d;
		            		})])
		            		.range([0, width]);



		    svg.attr('height', height);


		    svg.selectAll('rect')
		      .data(data).enter()
		        .append('rect')
		        .attr('height', barHeight)
		        .attr('width', function(d) {
		        	// return d.value;
		        	return d.value;
		        })
		        .attr('x', Math.round(margin/2))
		        .attr('y', function(d,i) {
		          return i * (barHeight + barPadding);
		      	});
			};

			// test run d3
			scope.render(theDataToPlot);	// theDataToPlot

			
			});
		}
	};
}]);










//eod