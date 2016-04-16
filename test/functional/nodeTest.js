'use strict';

jest.unmock('../../dist/index');

const createAsynchronousForm = require('../../dist/index');

describe('asynchronous-form', () => {
  it('is a function', () => {
    expect(typeof createAsynchronousForm).toEqual('function');
  });
});
