/** @private */
const BaseModel = require('./BaseModel');
/** @private */
const util = require('util');

/**
 * Initializes collection and starts listening to server for updates, then accoringly notifies view.
 *
 * @constructor
 * @this {BaseCollection}
 */
class BaseCollection {
  constructor({ message, Notifications }) {
    const url = this.url = "ws://localhost:8011/stomp";
    const client = this.client = Stomp.client(url);

    /** @public */
    this.Notifications = Notifications;

    if(message) {
      /** @public */
      this.models = Array.isArray(message) ? [...message] : [message];
    } else {
      /** @public */
      this.models = [];
    }

    client.debug = msg => console.info(msg);
    client.connect({},
      () => {
        util.log('Successfully connected to the server.');
        this.susbscribe();
      },
      () => {
        util.log('Failed to connect to the server.');
      });

    Notifications.subscribe('server:start', this.susbscribe.bind(this));
    Notifications.subscribe('server:stop', this.unsubscribe.bind(this));
  }

  /**
   * Creates a subscription beteen collection and server
   * 
   * @this   {BaseCollection}
   * @return {Object}       Acknowledgement object
   */
  susbscribe() {
    if(this.subscription) {
      return false;
    }
    return this.subscription = this.client.subscribe('/fx/prices', this.updateViews.bind(this));
  }

  /**
   * Un-Subscribe/Stop listening to updates from server.
   *
   * @this   {BaseCollection}
   * @return {Boolean}      Boolean value notifying if collection has successfully unsubscribed
   */
  unsubscribe() {
    if(!this.subscription) {
      return false;
    }

    this.subscription.unsubscribe();
    this.subscription = undefined;
    return true;
  }

  /**
   * Checks if the message is already present in collection or not then accordingly takes action for update/create.
   *
   * @this   {BaseCollection}
   * @param  {Object}       message Message object received from server to be updated in collection
   * @return {Boolean}        Boolean value notifying if the update has been successfull or not
   */
  updateCollection(message) {
    if(!message) {
      return false;
    }

    const { models } = this;
    const messageIndex = models.findIndex(messageModel => messageModel.getValue('name') === message.name);

    if(messageIndex > -1) {
      models[messageIndex].updateModel(message);
    } else {
      models.push(new BaseModel(message));
    }
    return true;
  }

  /**
   * Receives the JSON message from server, parses it, then updates collection and accordingly notifies view to re-render.
   *
   * @this   {BaseCollection}
   * @param  {Object}       message JSON message received from server
   * @return {Boolean}        Boolean value notifying if the event has been triggered for updating view
   */
  updateViews(message) {
    if(!message) {
      return false;
    }

    let messageBody = message.body;

    try {
      messageBody = JSON.parse(messageBody);
    } catch(e) {
      util.log(e);
      return false;
    }

    this.updateCollection(messageBody);
    this.Notifications.trigger('update:view', this.models);
    return true;
  }
}

/**
 * BaseCollection
 * @type {Function}
 */
module.exports = BaseCollection;