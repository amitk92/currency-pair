/**
 * Notifications
 * It creates and maintains list of events and their subscribers
 *
 * @constructor
 * @this {Notifications}
 */
class Notifications {
  constructor() {
    /** @private */
    this.eventsList = [];
    this.subUid = -1;
  }

  /**
   * Adds a subscriber to the list of subscribers for an event. If event is not present create one and subscribers list.
   *
   * @this   {Notifications}
   * @param  {String}   eventName Name of the event.
   * @param  {Function} callback  The callback function to execute when the event is fired.
   * @return {Number}             The subsciption Id, also used to unsubscribe the callback.
   */
  subscribe(eventName, callback) {
    if(!this.eventsList[eventName]) {
      this.eventsList[eventName] = []
    }

    const token = ++this.subUid;

    this.eventsList[eventName].push({
      token,
      callback
    });

    return token;
  }

  /**
   * Removes a subscriber from the list of subscribers.
   *
   * @this   {Notifications}
   * @param  {String}  token Subscription Id that was returned when the callback was added to list of subscribers.
   * @return {Boolean}       Boolean(true/false), notifying success/failure.
   */
  unsubscribe(token) {
    const { eventsList } = this;

    for(const event in this.eventsList) {
      if(eventsList[event]) {
        for(let i = 0; i < eventsList[event].length; i++) {
          if(eventsList[event][i].token === token) {
            eventsList[event].splice(i, 1);
            return token;
          }
        }
      }
    }
    return false;
  }

  /**
   * Fires the event, by calling the callback for all subcribers.
   * 
   * @this   {Notifications}
   * @param  {String}  eventName Name of the event to ber fired.
   * @return {Boolean}           Boolean(true/false), notifying success/failure.
   */
  trigger(eventName) {
    if(!this.eventsList[eventName]) {
      return false;
    }

    for(const event in this.eventsList) {
      if(event === eventName) {
        const args = Array.prototype.slice.call(arguments);
        args.splice(0, 1);

        for(let j = 0; j < this.eventsList[eventName].length; j++) {
          this.eventsList[eventName][j].callback.apply(this, args);
        }
      }
    }

    return true;
  }
}

/**
 * Notifications
 * @type {Function}
 */
module.exports = Notifications;