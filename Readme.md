DB Updating Table Dev Challenge - Amit Kumar
============================================

This assignment has been completed as per the guidelines mentioned in the index.html (which is now instructions.html) and pdf file.

To view the project, plese run the following commands

```
npm install
npm start
```

from within this directory.  This will start a server (using webpack)
that supports hot reloading but also provides a stomp/ws endpoint providing fake
fx updates.

Once the server has been started, please navigate to http://localhost:8011
to view the completed assignment.


I have followed the basic MV* observable pattern to complete this project and have not used
any pre-built frameworks for the same. I have created a Notifcations class which maintain all
the subscriptions for all event types and is also responsible to closing/firing any subscription
thus notifying the callback.
There is one BaseModel class which acts as a decorator for all messages, adding some methods whenever
a message is added to the collection. 
The BaseCollection is collection of all messages(models) which is responsible for updating view and 
listening to server for updates.
The BaseView class listens to updates from collection and accordingly updates the DOM.