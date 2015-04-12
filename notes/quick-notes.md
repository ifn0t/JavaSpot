some notes
===

checking out how some basic CRUD ops work [here](http://meanjs.org/docs.html#article-example)

##Express backend

MVC -> MC, handling model and controller, Angular handling the views.

1. Mongoose Model

schema objects

2. mongoose schema

used to define the structure of app data.
Entries -> Documents in MongoDB
schemas describing the types of properties they have
++ relations and references exist between them.



3. validation and middleware

where we can add additonal functions that validate our data before saving it
done properly with middleware.. passport??

*middleware* is used whenever we want to execute code before or after we run any kind
of operation on a entry. allowing validation, authorization, monitoring and other operations.


### Express controller

controllers -> add query to db, + perform server side calculations before relaying data to client.

basic CRUD operations in our Express controller are:
- create
- read  // return single article entry
- update  // single article
- delete
- list  // list of all articles
- articleById // sets the current article obj by its ID.
- hasAuthorization  // methods checks if the current user created the current article.

### Express routes


assigning the express controller methods to REST endpoints in **app/routes/articles.js**
- i.e. GET && POST
- ~5 , 1/CRUD operation
- list, new article, return article by ID, update article by ID, delete article by ID.



#### express mocha tests
tl;dr



## AngularJS Front-End Module

## Folder structure

each angular module is organized in an isolated folder containing the logical structure of the module functionality.

- assign client side code to our **public/modules/modules_name**

inside each module we have included:
- config
- - any angularjs configurations, routes.js, angular routing
- controllers
- - angular controllers
- services
- - 
- tests
- views
- - any partials views related to the articles module.


### Angular JS Service `ngResouce`

- allows easy connection to RESTful endpoints in Express
- `$resource` when working w/ CRUD operations
- ! warning when using `update` user `put`

### angular js controller

- in correspondence w/ CRUD operations


### angular views!

- the html template used per view in application.
- renders the data that is passed through the controller.


### angular js routes

Angular `UI-Router` defines various routes of the module..
This magic occurs only because each route is defined using the
`$stateProvider` service, and defines a path to the themplate, which
will be rendered when navigating to a specific URL.


### angular js menu items

enables to add menus firectly from the module configuration file.
- look @ **articles.client.config.js**
- a drop down menu for the topbar, handles `list articles` and `create` articles.


--stopped at angular unit testing --


## Summary:

our backend consists of Express and middleware for handling data coming and going into the mongoose/mongod db. We structure our data via mongoose schemas, which are properties and a data obkect that can easily be passed around.





