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
		// globally accessable data for directive.
		// 
		
		$scope.data = [
			{
				name: 'expresso shots',
				value: 99
			},
			{
				name: 'syrup',
				value: 77
			},
			{
				name: 'sugar',
				value: 55
			},
			{
				name: 'dairy',
				value: 33
			}
		];


		// 
		// Find existing Recipe
		// 

		$scope.findOne = function() {
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
				var fullCup = 16,
					emptyCup = 0,
					sugarUnit = 0.16,	// 5 gram package
					syrupUnit = 0.75,
					espressoUnit = 1;



				// 
				// find out measurements of conent for single 16 fl-oz coffee
				// 
				// http://www.exploratorium.edu/cooking/convert/

				var recipeData = {
					currentEspresso: $scope.recipe.espressoShots,
					currentSyrup: $scope.recipe.syrup,
					currentSugar: $scope.recipe.sugar,
					currentDairy: $scope.recipe.dairy
				};

				console.log(recipeData);


				var totalEsp = espressoUnit * $scope.recipe.espressoShots;
				console.log('total amt of espresso is : ' , totalEsp);
				$scope.data[0].value = ((totalEsp / fullCup) * 100 );


				var totalSyrup = 0;
				if ($scope.recipe.syrup) {
					console.log('user has choosen a syrup : ', $scope.recipe.syrup);
					totalSyrup += syrupUnit;
					console.log('totalSyrup ', totalSyrup);
				}
				$scope.data[1].value = ((totalSyrup / fullCup) * 100 );


				var totalSugar;
				if ($scope.recipe.sugar) {
					console.log('user has choosen sugar: ' , $scope.recipe.sugar);
					totalSugar = ($scope.recipe.sugar * sugarUnit);
				} else {
					totalSugar = 0;	// if no sugar == to 0;
					// totalSugar = 6 * sugarUnit;	- test
				}
				$scope.data[2].value = ((totalSugar / fullCup) * 100);


				// all the ingredient - cup volumn should be dairy/froth.
				// using a 16 fl-oz based cupe.

				var totalDairy = fullCup - (totalSugar + totalEsp + totalSyrup);
				console.log('totalDairy ',totalDairy);
				$scope.data[3].value = ((totalDairy / fullCup) * 100);
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
				console.log('length of this array is: ' , theDataToPlot.length);



				// Browser onresize event
		          // window.onresize = function() {
		            // scope.$apply();
		          // };

		          // Watch for resize event
//		          scope.$watch(function() {
//		           return elem($window)[0].innerWidth;
//		          }, function() {
//		            scope.render(theDataToPlot);
//		          });

		        scope.render = function(data) {
		            // our custom d3 code
		            if (!data) {
		            	console.log('error, data not good.');
		            	return;
		            }

		            console.log('incoming data for d3', data);

		            var width = 360,
			        	height = 360,
			        	radius = Math.min(width, height) / 2,
						color = d3.scale.category20b();


			        // http://plnkr.co/edit/kgukfV?p=preview
					var svg = d3.select(elem[0])	// this goes through
			          .append('svg')
			          .attr('width', width)
			          .attr('height', height)
			          .append('g')
			          .attr('transform', 'translate(' + (width / 2) + 
			            ',' + (height / 2) + ')');

			        // draw arc
			        var arc = d3.svg.arc()
			          .outerRadius(radius);

			        // pie
			        var pie = d3.layout.pie()
			          .value(function(d) { 
			          	return d.value; 
			          })
			          .sort(null);

			        var path = svg.selectAll('path')
			          .data(pie(data))
			          .enter()
			          .append('path')
			          .attr('d', arc)
			          .attr('fill', function(d, i) { 
			            return color(d.data.name);
			        });

			        // text
			        g.append("text")
				      .style("text-anchor", "middle")
				      .text(function(d) { return d.data.name; });
				};

				// test run d3
				scope.render(theDataToPlot);	// theDataToPlot			
			});
		}
	};
}]);










//eod