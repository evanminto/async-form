'use strict';

jest.unmock('../../dist/browser');

require('../../dist/browser');

function createForm() {
  const form = document.createElement('form');
  const textInput = document.createElement('input');
  const passwordInput = document.createElement('password');
  const checkboxInput = document.createElement('checkbox');
  const select = document.createElement('select');
  const radio1 = document.createElement('radio');
  const radio2 = document.createElement('radio');
  const radio3 = document.createElement('radio');
  const submitButton = document.createElement('button');

  textInput.name = 'text';
  textInput.type = 'text';
  passwordInput.name = 'password';
  passwordInput.type = 'password';
  checkboxInput.type = 'checkbox';
  checkboxInput.value = '1';
  submitButton.type = 'submit';

  select.name = 'select';

  const option1 = document.createElement('option');
  const option2 = document.createElement('option');

  option1.value = '0';
  option2.value = '1';

  select.appendChild(option1);
  select.appendChild(option2);

  radio1.name = radio2.name = radio3.name = 'radio';
  radio1.value = 'a';
  radio2.value = 'b';
  radio3.value = 'c';

  form.appendChild(textInput);
  form.appendChild(passwordInput);
  form.appendChild(checkboxInput);
  form.appendChild(select);
  form.appendChild(radio1);
  form.appendChild(radio2);
  form.appendChild(radio3);
  form.appendChild(submitButton);

  document.body.appendChild(form);

  return form;
}

describe('window.asyncForm', () => {
  let forms = [];

  function itFetchesAndFiresEvents() {
    let indexes = arguments;

    describe("when clicking the submit button", () => {
      let form1;
      let form2;

      beforeEach(() => {
        form1 = forms[indexes[0]];

        if (indexes.length > 1) {
          form2 = forms[indexes[1]];
        }
      });

      it("dispatches a \"submitting\" event", () => {
        const submittingCallback = jest.fn();

        form1.addEventListener('submitting.asyncForm', submittingCallback);
        form1.querySelector('button').click();

        expect(submittingCallback).toBeCalled();

        if (form2) {
          const submittingCallback2 = jest.fn();

          form2.addEventListener('submitting.asyncForm', submittingCallback2);
          form2.querySelector('button').click();

          expect(submittingCallback2).toBeCalled();
        }
      });

      pit("dispatches a \"submitted\" event", () => {
        return (new Promise(resolve => {
          form1.addEventListener('submitted.asyncForm', resolve);
          form1.querySelector('button').click();
        }))
          .then(() => {
            if (form2) {
              return new Promise(resolve => {
                form2.addEventListener('submitted.asyncForm', resolve);
                form2.querySelector('button').click();
              });
            }
          });
      });

      pit("dispatches a \"success\" event if the request receives a successful response", () => {
        return new Promise(resolve => {
          form1.addEventListener('success.asyncForm', resolve);
          form1.querySelector('button').click();
        })
          .then(() => {
            if (form2) {
              return new Promise(resolve => {
                form2.addEventListener('success.asyncForm', resolve);
                form2.querySelector('button').click();
              });
            }
          });
      });

      pit("dispatches a \"fail\" event if the request receives an unsuccessful response", () => {
        form1.action = '/fail';

        if (form2) {
          form2.action = '/fail';
        }

        return new Promise((resolve, reject) => {
          form1.addEventListener('fail.asyncForm', resolve);
          form1.querySelector('button').click();
        })
          .then(() => {
            if (form2) {
              return new Promise(resolve => {
                form2.addEventListener('fail.asyncForm', resolve);
                form2.querySelector('button').click();
              });
            }
          });
      });

      pit("dispatches an \"error\" event if the request does not complete", () => {
        form1.action = '/notvalid';

        if (form2) {
          form2.action = '/notvalid';
        }

        return new Promise((resolve, reject) => {
          form1.addEventListener('error.asyncForm', resolve);
          form1.querySelector('button').click();
        })
          .then(() => {
            if (form2) {
              return new Promise(resolve => {
                form2.addEventListener('error.asyncForm', resolve);
                form2.querySelector('button').click();
              });
            }
          });
      });
    });
  }

  beforeEach(() => {
    window.fetch = jest.fn().mockImpl((request) => {
      return new Promise((resolve, reject) => {
        if (request.url.substring(0, 8) === '/success') {
          resolve(new Response('', {
            ok: true,
            status: 200,
            statusText: 'OK',
          }));
        } else if (request.url.substring(0, 5) === '/fail') {
          resolve(new Response('', {
            ok: false,
            status: 400,
            statusText: 'Not OK',
          }));
        } else {
          reject();
        }
      });
    });

    forms = [];

    forms.push(createForm());
    forms.push(createForm());

    forms[0].id = 'form0';
    forms[0].classList.add('js-async-form');
    forms[0].action = '/success';
    forms[0].method = 'get';

    forms[1].id = 'form1';
    forms[1].classList.add('js-async-form');
    forms[1].action = '/success';
    forms[1].method = 'post';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  })

  it('is a function', () => {
    expect(typeof window.asyncForm).toEqual('function');
  });

  describe('when passed a form element', () => {
    beforeEach(() => {
      asyncForm(forms[0]);
    });

    itFetchesAndFiresEvents(0);
  });

  describe("when passed a NodeList", () => {
    beforeEach(() => {
      asyncForm(document.querySelectorAll('#form0, #form1'));
    });

    itFetchesAndFiresEvents(0, 1);
  });

  describe("when passed a selector string", () => {
    beforeEach(() => {
      asyncForm('.js-async-form');
    });

    itFetchesAndFiresEvents(0, 1);

    describe("when a form is dynamically added to the page that matches the selector", () => {
      beforeEach(() => {
        forms.push(createForm());

        forms[2].id = 'new_form';
        forms[2].classList.add('js-async-form');
        forms[2].action = '/success';
        forms[2].method = 'post';
      });

      itFetchesAndFiresEvents(2);
    });
  });

  describe("when submitting the form via JavaScript", () => {
    it("dispatches a \"submitting\" event", () => {
      const submittingCallback = jest.fn();

      forms[0].addEventListener('submitting.asyncForm', submittingCallback);
      asyncForm.submit(forms[0]);

      expect(submittingCallback).toBeCalled();
    });

    pit("dispatches a \"submitted\" event", () => {
      return new Promise(resolve => {
        forms[0].addEventListener('submitted.asyncForm', resolve);
        asyncForm.submit(forms[0]);
      });
    });

    pit("dispatches a \"success\" event", () => {
      return new Promise(resolve => {
        forms[0].addEventListener('success.asyncForm', resolve);
        asyncForm.submit(forms[0]);
      });
    });

    pit("dispatches a \"fail\" event", () => {
      forms[0].action = '/fail';

      return new Promise(resolve => {
        forms[0].addEventListener('fail.asyncForm', resolve);
        asyncForm.submit(forms[0]);
      });
    });

    pit("dispatches a \"error\" event", () => {
      forms[0].action = '/notvalid';

      return new Promise(resolve => {
        forms[0].addEventListener('error.asyncForm', resolve);
        asyncForm.submit(forms[0]);
      });
    });
  });

  describe("when passed undefined", () => {
    it("throws an error", () => {
      expect(asyncForm.bind(undefined, undefined)).toThrow();
    });
  });

  describe("when passed null", () => {
    it("throws an error", () => {
      expect(asyncForm.bind(undefined, null)).toThrow();
    });
  });

  describe("when passed a boolean", () => {
    it("throws an error", () => {
      expect(asyncForm.bind(undefined, true)).toThrow();
    });
  });

  describe("when passed a number", () => {
    it("throws an error", () => {
      expect(asyncForm.bind(undefined, 13)).toThrow();
    });
  });

  describe("when passed a generic Object", () => {
    it("throws an error", () => {
      expect(asyncForm.bind(undefined, {})).toThrow();
    });
  });

  describe("when passed a non-form HTML element", () => {
    it("throws an error", () => {
      expect(asyncForm.bind(undefined, document.createElement('div'))).toThrow();
    });
  });
});
