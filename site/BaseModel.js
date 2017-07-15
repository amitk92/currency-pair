/**
 * @private
 * Maximum number of mid prices to store.
 * @type {Number}
 */
const MAX_MID_PRICE_STORED = 30;

/**
 * Calculates mid price by finding average of bestBid and bestAsk.
 *
 * @private
 * @this   {undefined}
 * @param  {Number}    options.bestBid Best bid value for the current message
 * @param  {Number}    options.bestAsk Best ask value for the current message
 * @return {Number}      			   Mide price value
 */
const getMidPrice = ({ bestBid, bestAsk }) => (bestBid + bestAsk) / 2;

/**
 * Decorates each message received from server.
 *
 * @constructor
 * @this {BaseModel}
 */
class BaseModel {
  constructor(message) {
    /** @public */
    this.midPrice = [];
    this.parseMessage(message);
  }

  /**
   * Returns value of the key passed
   *
   * @this   {BaseModel}
   * @param  {String}    key Name of key whose value needs to be accessed
   * @return {}     	     Value for the requested key
   */
  getValue(key) {
    return this[key];
  }

  /**
   * Decorates the message received from server
   *
   * @this   {BaseModel}
   * @param  {Object}    message Message object received from server, to be decorated
   * @return {Object}            Object of processed message
   */
  parseMessage(message) {
    if(!message) {
      return false;
    }

    const { midPrice } = this;

    for(const key in message) {
      this[key] = message[key];
    }

    if(midPrice.length === MAX_MID_PRICE_STORED) {
      midPrice.pop();
    }

    midPrice.unshift(getMidPrice(message));

    return this;
  }

  /**
   * Update model externally wherever required
   *
   * @this   {BaseModel}
   * @param  {Object}    message Message object to be updated
   * @return {Object}            Updated message model
   */
  updateModel(message) {
    return this.parseMessage(message);
  }
}

/**
 * BaseModel
 * @type {Function}
 */
module.exports = BaseModel;