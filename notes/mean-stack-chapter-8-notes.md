MEAN Stack chapter 8 notes
====


MEAN Stack CRUD module is the basic building blocks of a MEAN App.

with MEAN our CRUD module is built from server-side Express components and
an Angular client module.

this chapter:
- set up mongoose model
- create Express controller
- wiring Express routes
- create & organize Angular module
- intro to `ngResource`
- implment Angular module MVC



each CRUD has
- 2 MVC structures supporting Express and Angular modular functionality.
- Express -> mongoose, express controller, and express routing.
- AngularJS -> views, AngularJS controller, service & routing config.
- 

## set up Express components

- create mongoose model used to save & valid articles/documents
- configure express controller
- wire Express routes to produce a RESTful API for controller methods

### p1. mongoose model

- call in mongoose dependencies
- Schema object
- create new Scehma
- -> define model fields
- lastly register this ArticleSchema to be used in Express Controller
- 
### p2. Express configuration

goto **config/mongoose.js**.

- prev make model,
- now: config model to be used by our app
`require` in our `module.exports = function() {...`
- next is create Articles Controller


### p3. setup Express controller

look in **app/controllers**
- create file
- require mongoose Article Obj. Scehma to be used in our new controller
- **before CRUD operations we write a simple function for mongoose error handling.**
- this error message works w/ mongoose error handling object!


```
// in app/controllers/articles.server.controller.js
var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].
        message;
    }
  } else {
    return 'Unknown server error';
  }
};

```

once error handling is done we may continue to writing our first CRUD controller: **create**.

#### create Express controller

- grabs item from body using HHTTP request body as JSON base object.
- mongoose model `save` method to save it into MongoDB
- i.e.:


```

exports.create = function(req, res) // http req and res
{
  var article = new Article(req.body);  // grabs whole body w/ entered data??
  
  article.creator = req.user; // grabs entry data
  
  
  article.save(function(err) {  // save to db function
    if(err) { // shoots out an error.
      return res.status(400).send({
        message: getErrorMessage(err);  // nice error message.
      });
    } else {
      res.json(article);  // output json data!
    }
  });
};

```

#### list, CRUD op

- retreive list of existing article, using `list()` method

```

exports.list = function(req, res) {
// use find() mongoose method.
// may add additonal mongoose modifiers to query.
  Article.find().sort('-created').populate('creator', 'firstName lastName fullName')
  .exec(function(err, articles) {
    if(err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  })
}


```

### rest of CRUD operations

will rely on middleware instread and handling routing parameters.
using **read() middleware of the Express controller.**
accomplished by reading the `articleId` from the URL paths.
`app.param()` handles route parameters.


```
exports.articleById = function(req, res, next, id) {
  Article.findById(id).populate('creator', 'firstName lastName fullName')
  .exec(function(err, article){
    if(err) return next(err);
    if(!article) return next(new Error('failed to load article ' + id ));
    
    // if no errors produced, we continue..
    req.article = article;
    next();
  });
};

```

### our read()

will simply output our article in json representation.

```

exports.read = function(req, res){
  res.json(req.article);
};

```

### our update()

simple updates an existing article

```

exports.update = function(req, res) {
  var article = req.article;
  
  article.title = req.body.title;
  
  article.content = req.body.content;
  
  article.save(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err);
      });
    } else {
      res.json(article);
    }
  })
}

```

### simple CRUD delete() Express middleware controller

using mongoose model `remove()` method to delete existing article from db.


```

exports.delete = function(req, res){
  var article = req.article;
  
  article.remove(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err);
      });
    } else {
      res.json();
    }
  });
};

```
that wraps up our CRUD operations

## implement authentication middleware

- need a `req.user` object to know a user is logged in
- use Express users controller for solution.

```

exports.requiresLogin = function(req, res, next){
if(!req.isAuthenitcated()) {
  return res.status(401).send({
    message: 'User is not logged in.';
  });
}
next();
};

```

this will require `passport` module

### appending authorizations

this code is to change the functionality so that only a user who created the 
article to have control over deleting that article or not. This uses
Express and Passport to work:

```
exports.hasAuthorization = function(req, res, next){
  if(req.article.creator.id !== req.user.id){
    return res.status(403).send({
      message: 'user is not authorized';
    });
  } 
}
else {
    next();
  };

```



### Wiring Express Routes

RESTful API architectural design.
- the RESTful API provides a coherent service structure
- that represents a set of actions you can perform on an application resource.


common RESTful API rules:

- base URI per resource, https://localhost:3000/articles
- a data structure, JSON
- usage of standard HTTP methods, get, post, put & delete.

these rules allow properly routed HTTP requests to use their 
rightful controller method.

note we pass around a variable parameter being the `articleId`

from here we wire up our routes w/ the corresponding methods made earlier.
goto `app/routes`

these routes will also include authentication routing.

express `app.route()`


### last configure in Express App

goto `config/express.js` app a path to the newly created express app routes,
this turns your web app into an easy api! 

## Next is to use AngularJS to communicate w/ it.







