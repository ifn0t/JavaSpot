# JavaSpot_Application


##todo list:


- got profile page working to extent that a logged in user can view their own profile,
need to add ability for other users to be able to click to another users profile.
- get listing of users post to display on their profile.



## listing on user page


1. call list from recipes route, 
2. section refers to recipes controller | or service?
3. angular $filter or | filter to display content only by user_id.

[note](https://groups.google.com/forum/#!topic/meanjs/4R7rIolH9bs)

this method is sort of how I was wanting to implement it,
however doesn't use $filter, so may be more work than needed.


~For your second question, you can call the list from the recipes routes by making a section that refers to the recipes controller. Just look at how that gets set up in your Angular view. Then, you can use an Angular filter to only display content that matches a certain user_id.~

