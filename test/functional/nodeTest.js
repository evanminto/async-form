'use strict';

jest.unmock('../../src/index');

const createAsynchronousForm = require('../../src/index');

describe('asynchronous-form', () => {
  it('is a function', () => {
    expect(typeof createAsynchronousForm).toEqual('function');
  });
});
