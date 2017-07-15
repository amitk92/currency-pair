/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

const Notifications = require('./site/Notifications');
const BaseCollection = require('./site/BaseCollection');
const BaseView = require('./site/BaseView');

const NotificationsInstance = new Notifications();

new BaseCollection({
  Notifications: NotificationsInstance
});
new BaseView(NotificationsInstance);