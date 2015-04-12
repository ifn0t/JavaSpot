chapter 8, part 2
====


## the angular part

using ngResource to communicate w/ backend API
if your backend API is a RESTful structured data source.

ngResource module creates an object that can handle the basic 
routes of a RESTful resource.

1. install w/ bower, this is an external angular resource
2. add to your index html template, w/ other scripts
3. finally, add `ngResource` as an dependency for main app module. in public/application.js
4. ... profit, we can now use thengResource.


### using $resource / ngResource service

- factory to be injected into angular entities.
- uses base URL w/ set of config options
- $resouce factory acceptable params:
- 1. URL
- 2. ParamDefaults
- 3. Actions
- 4. Options
