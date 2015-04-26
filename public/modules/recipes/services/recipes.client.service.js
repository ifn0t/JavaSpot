'use strict';


// tranform the photo (passed as data)
// using `fd` to submit multipart-data
// `fd` === form data.

function tranformRecipe(data) {   

    // guessing this means the data didnt get through
    if (data === undefined )
        return data;

    console.log('tranforming that data.' + data);

    // form data, fd
    var fd = new FormData();    // ??? 

    // appending the types of data 
    // to this new form data object.
    fd.append( 'file' , data.file );
    fd.append( 'name' , data.name );
    fd.append( 'description' , data.description );
    fd.append( 'honey' , data.honey );
    fd.append( 'espressoShots' , data.espressoShots );
    fd.append( 'syrup' , data.syrup );
    fd.append( 'dairy' , data.dairy );

    // return our appended data
    return fd;
}

// angular factory

angular.module('recipes').factory('Recipes', ['$resource', 
    function($resource) {
        return $resource('recipes/:recipeId', { recipeId: '@_id'
        }, {
            update: {
                method: 'PUT',

                    transformRequest: tranformRecipe,
                    headers: {'Content-Type': undefined}

            },
            save: {
                method:  'POST',

                    transformRequest: tranformRecipe,
                    headers: {'Content-Type': undefined}
            }
        });
    }
]);

