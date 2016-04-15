'use strict';

jest.unmock('../../src/customEvent');

jest.mock('custom-event', () => {
  return function(type, init) {
    init = Object.assign({
      bubbles: false,
      cancelable: false,
      detail: null,
      target: null,
    }, init || {});

    this.type = type;
    this.bubbles = init.bubbles;
    this.cancelable = init.cancelable;
    this.detail = init.detail;
    this.target = init.target;

    this.preventDefault = () => {};
    this.stopImmediatePropagation = () => {};
    this.stopPropagation = () => {};
  };
});

const createCustomEvent = require('../../src/customEvent');

describe('customEvent', () => {
  it("is a function", () => {
    expect(createCustomEvent).toBeDefined();
    expect(typeof createCustomEvent).toEqual('function');
  });

  function itCreatesACustomEvent() {
    it("creates a new custom event with a type", () => {
      const event = createCustomEvent('test');

      expect(event.type).toBeDefined();
      expect(event.type).toEqual('test');

      expect(event.bubbles).toBeDefined();
      expect(event.cancelable).toBeDefined();
      expect(event.detail).toBeDefined();
      expect(event.target).toBeDefined();

      expect(event.preventDefault).toBeDefined();
      expect(event.stopImmediatePropagation).toBeDefined();
      expect(event.stopPropagation).toBeDefined();
    });

    it("creates a new custom event with a type and init values", () => {
      const event = createCustomEvent('test', {
        bubbles: true,
        detail: {
          test: true,
        },
      });

      expect(event.type).toEqual('test');
      expect(event.detail).toEqual({
        test: true,
      });
    });
  }

  describe("when window.CustomEvent is already defined", itCreatesACustomEvent);

  describe("when window.CustomEvent is defined but throws an exception", () => {
    let oldCustomEventConstructor;

    beforeEach(() => {
      oldCustomEventConstructor = CustomEvent;
      window.CustomEvent = function() {
        throw "Ahhh IE is dumb!";
      };
    });

    afterEach(() => {
      window.CustomEvent = oldCustomEventConstructor;
    });

    itCreatesACustomEvent();
  });

  describe("when window.CustomEvent is not defined", () => {
    let oldCustomEventConstructor;

    beforeEach(() => {
      oldCustomEventConstructor = CustomEvent;
      window.CustomEvent = undefined;
    });

    afterEach(() => {
      window.CustomEvent = oldCustomEventConstructor;
    });

    itCreatesACustomEvent();
  });
});
