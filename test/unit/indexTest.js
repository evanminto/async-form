'use strict';

jest.unmock('../../dist/index');

const createAsynchronousForm = require('../../dist/index');

describe('index', () => {
  it('is a function', () => {
    expect(typeof createAsynchronousForm).toEqual('function');
  });

  it('has method submit', () => {
    expect(typeof createAsynchronousForm.submit).toEqual('function');
  });
});
