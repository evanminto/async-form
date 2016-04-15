'use strict';

jest.unmock('../../src/index');

const index = require('../../src/index');

describe('index', () => {
  it("returns a function", () => {
    expect(index).toBeDefined();
    expect(typeof index).toEqual('function');
  });
});
