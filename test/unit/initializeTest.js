'use strict';

jest.unmock('../../src/initialize');

jest.mock('matches-selector', () => {
  return (element, selector) => {
    if (selector === '.js-async-form' && element.classList.contains('js-async-form')) {
      return true;
    }

    return false;
  };
});

const initialize = require('../../src/initialize');
const mockAsyncForm = require('../../src/asyncForm');

describe('initialize', () => {
  let forms;

  beforeEach(() => {
    document.body.innerHTML = '';

    forms = [];

    forms.push(document.createElement('form'));
    forms.push(document.createElement('form'));
    forms.push(document.createElement('form'));

    forms[0].id = 'form0';
    forms[1].id = 'form1';
    forms[2].id = 'form2';

    forms[0].classList.add('js-async-form');
    forms[1].classList.add('js-async-form');

    forms[0].appendChild(document.createElement('button'));
    forms[1].appendChild(document.createElement('button'));
    forms[2].appendChild(document.createElement('button'));

    document.body.appendChild(forms[0]);
    document.body.appendChild(forms[1]);
    document.body.appendChild(forms[2]);
  });

  it("is a function", () => {
    expect(initialize).toBeDefined();
    expect(typeof initialize).toEqual('function');
  });

  describe("when passed a form", () => {
    describe("when clicking the button in that form", () => {
      it("calls asyncForm with the form", () => {
        initialize(forms[0]);
        forms[0].querySelector('button').click();

        expect(mockAsyncForm).toBeCalledWith(forms[0]);
      });
    });
  });

  describe("when passed a NodeList of forms", () => {
    describe("when clicking the button in each form", () => {
      it("calls asyncForm with the forms", () => {
        initialize(document.querySelectorAll('#form0, #form2'));

        mockAsyncForm.mockClear();

        forms[0].querySelector('button').click();
        expect(mockAsyncForm).toBeCalledWith(forms[0]);

        forms[1].querySelector('button').click();
        expect(mockAsyncForm).not.toBeCalledWith(forms[1]);

        forms[2].querySelector('button').click();
        expect(mockAsyncForm).toBeCalledWith(forms[2]);
      });
    });
  });

  describe("when passed a selector string", () => {
    describe("when clicking the button in each form in the selector", () => {
      it("calls asyncForm with the forms", () => {
        initialize('.js-async-form');

        mockAsyncForm.mockClear();

        forms[0].querySelector('button').click();
        expect(mockAsyncForm).toBeCalledWith(forms[0]);

        forms[1].querySelector('button').click();
        expect(mockAsyncForm).toBeCalledWith(forms[1]);

        forms[2].querySelector('button').click();
        expect(mockAsyncForm).not.toBeCalledWith(forms[2]);
      });
    });
  });

  describe("when passed undefined", () => {
    it("throws an error", () => {
      expect(initialize).toThrow();
    });
  });

  describe("when passed null", () => {
    it("throws an error", () => {
      expect(initialize.bind(undefined, null)).toThrow();
    });
  });

  describe("when passed an integer", () => {
    it("throws an error", () => {
      expect(initialize.bind(undefined, 13)).toThrow();
    });
  });

  describe("when passed a plain object", () => {
    it("throws an error", () => {
      expect(initialize.bind(undefined, {})).toThrow();
    });
  });

  describe("when passed a non-form element", () => {
    it("throws an error", () => {
      expect(initialize.bind(undefined, document.createElement('div'))).toThrow();
    });
  });
});
