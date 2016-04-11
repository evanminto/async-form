'use strict';

jest.unmock('../../src/index');

require('../../dist/browser');

describe('window.asyncForm', () => {
  it('is a function', () => {
    expect(typeof window.asyncForm).toEqual('function');
  });
});
