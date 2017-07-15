/** @private */
const Notifications = require('../site/Notifications');
const BaseModel = require('../site/BaseModel');
const util = require('util');

/** @private */
const _noop = function() {};

/**
 * Test cases to test working of Notifications
 */
describe("A subscription", function() {
  /** @private */
  const EVENT_NAME = 'event:test';
  const NotificationsInstance = new Notifications();
  const subId = NotificationsInstance.subscribe(EVENT_NAME, _noop);

  it("with Notifications is successful", function() {
    expect(subId).toBeGreaterThan(-1);
  });

  it("was trigerred successfully", function() {
    expect(NotificationsInstance.trigger(EVENT_NAME)).toBe(true);
  });

  it("was ended successfully", function() {
    expect(NotificationsInstance.unsubscribe(subId)).toBe(subId);
  });
});

/**
 * Test cases to test working of model
 */
describe("The model's", function() {
  /** @private */
  const DUMMY_MESSAGE = {
    "name": "usdjpy",
    "bestBid": 106.7297012204255,
    "bestAsk": 107.25199883791178,
    "openBid": 107.22827132623534,
    "openAsk": 109.78172867376465,
    "lastChangeAsk": -4.862314256927661,
    "lastChangeBid": -2.8769211401569663
  };
  const DUMMY_MESSAGE_UPDATED = {
    "name": "usdjpy",
    "bestBid": 100.7297012204255,
    "bestAsk": 140.25199883791178,
    "openBid": 250.22827132623534,
    "openAsk": 220.78172867376465,
    "lastChangeAsk": 0.862314256927661,
    "lastChangeBid": -9.8769211401569663
  };
  const midPrice = (DUMMY_MESSAGE.bestBid + DUMMY_MESSAGE.bestAsk) / 2;
  const Model = new BaseModel(DUMMY_MESSAGE);

  it("name was retrieved successfully", function() {
    expect(Model.getValue('name')).toBe(DUMMY_MESSAGE.name);
  });

  it("midPrice value was retrieved successfully", function() {
    expect(Model.getValue('midPrice')[0]).toBe(midPrice);
  });

  it("was updated successfully", function() {
    expect(Model.updateModel(DUMMY_MESSAGE_UPDATED).getValue('lastChangeAsk')).toBe(DUMMY_MESSAGE_UPDATED.lastChangeAsk);
  });
});