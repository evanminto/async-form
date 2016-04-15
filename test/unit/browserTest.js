'use strict';

jest.unmock('../../src/browser');

require('../../src/browser');

describe('window.asyncForm', () => {
  it("is a function", () => {
    expect(window.asyncForm).toBeDefined();
    expect(typeof window.asyncForm).toEqual('function');
  });
});
