const Notifications = require('./Notifications');
const util = require('util');

/**
 * Sorts the messages in ascending order according to lastChangeBid.
 *
 * @private
 * @this   {undefined}
 * @param  {Object} msg1 First message in the list of messages
 * @param  {Object} msg2 Second message in the list of messages
 * @return {Array}       Sorted messages in ascending order
 */
const sortMessages = (msg1, msg2) => {
  if(msg1.getValue('lastChangeBid') < msg2.getValue('lastChangeBid')) {
    return -1;
  }

  if(msg1.getValue('lastChangeBid') > msg2.getValue('lastChangeBid')) {
    return 1;
  }

  if(msg1.getValue('lastChangeBid') === msg2.getValue('lastChangeBid')) {
    return 0;
  }
};

/**
 * Table Header HTML String.
 *
 * @private
 * @this {undefined}
 * @type {String}
 */
const tableHeader = '<tr>' +
  '<td>Name</td>' +
  '<td>Current Best Bid Price</td>' +
  '<td>Current Best Ask Price</td>' +
  '<td>Best Bid Price Last Changed</td>' +
  '<td>Best Ask Price Last Changed</td>' +
  '<td>Price Change</td>' +
  '</tr>';

/**
 * Create HTML for rows of table to be rendered on UI.
 *
 * @private
 * @this   {undefined}
 * @param  {String} html          Concatenated HTML string for all messages
 * @param  {Object} sortedMessage Message object model
 * @return {String}               HTML string containing html for all rows of the table
 */
const getTableRow = (html, sortedMessage) => (html +
  '<tr>' +
  '<td>' + sortedMessage.getValue('name') + '</td>' +
  '<td>' + sortedMessage.getValue('bestBid') + '</td>' +
  '<td>' + sortedMessage.getValue('bestAsk') + '</td>' +
  '<td>' + sortedMessage.getValue('lastChangeBid') + '</td>' +
  '<td>' + sortedMessage.getValue('lastChangeAsk') + '</td>' +
  '<td id="spark-line-' + sortedMessage.getValue('name') + '"></td>' +
  '</tr>'
);

/**
 * Draws line graph in table using Sparkline.s
 * 
 * @param  {Object} message Message model whose line needs to be rendered on UI
 * @return {Object}         Object returned by Sparkline after creating the line
 */
const drawLine = message => Sparkline.draw(document.getElementById(`spark-line-${message.getValue('name')}`), message.getValue('midPrice'));

/**
 * Base view for listening to collection updates and accordingly re-rendering the view.
 *
 * @constructor
 * @this {BaseView}
 */
class BaseView {
  constructor(Notifications) {
    /** @public */
    this.Notifications = Notifications;

    this.startSubscription();
    document.querySelector('.play').addEventListener('click', this.startSubscription.bind(this));
    document.querySelector('.pause').addEventListener('click', this.stopSubscription.bind(this));
  }

  /**
   * Renders the table and inserts it into DOM.
   *
   * this    {BaseView}
   * @param  {Array}    messges Colelction of message models
   * @return {Boolean}          Boolean value notifying if the view update was successful or not
   */
  render(messges) {
    if(!messges) {
      return false;
    }

    const sortedMessages = messges.sort(sortMessages);

    document.querySelector('.table-body').innerHTML = tableHeader + sortedMessages.reduce(getTableRow, '');
    sortedMessages.forEach(drawLine);
    return true;
  }

  /**
   * Function to start listening for updates from collection.
   *
   * this    {BaseView}
   * @return {Number}   Subscription token id
   */
  startSubscription() {
    document.querySelector('.play-pause').classList.remove('stop');
    return this.subToken = this.Notifications.subscribe('update:view', this.render);
  }

  /**
   * Function to stop listening for updates from collection.
   *
   * this    {BaseView}
   * @return {undfined} Subscription token id set to undefined
   */
  stopSubscription() {
    document.querySelector('.play-pause').classList.add('stop');
    this.Notifications.unsubscribe(this.subToken);
    return this.subToken = undefined;
  }
}

/**
 * BaseView
 * @type {Function}
 */
module.exports = BaseView;