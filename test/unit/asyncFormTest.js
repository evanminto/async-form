'use strict';

let form;

jest.unmock('whatwg-fetch');
jest.unmock('../../src/asyncForm');

jest.mock('../../src/customEvent', () => {
  return (type, init) => {
    return new CustomEvent(type, init);
  };
});

jest.mock('get-form-data', () => {
  return (formElement) => {
    if (formElement === form) {
      return {
        foo: 'bar',
      };
    }
  };
});

jest.mock('query-string', () => {
  return {
    stringify(obj) {
      if (obj.foo === 'bar') {
        return 'foo=bar';
      }
    },
  };
});

const asyncForm = require('../../src/asyncForm');

describe('asyncForm', () => {
  it("is a function", () => {
    expect(asyncForm).toBeDefined();
    expect(typeof asyncForm).toEqual('function');
  });

  describe("when passing a form element", () => {
    let oldFetch;

    beforeEach(() => {
      oldFetch = window.fetch;

      window.fetch = jest.fn().mockImpl((request) => {
        return new Promise((resolve) => {
          if (request.url === '/success') {
            resolve(new Response('', {
              status: 200,
              ok: true,
              statusText: 'OK',
            }));
          } else if (request.url === '/fail') {
            resolve(new Response('', {
              status: 400,
              ok: false,
              statusText: 'Failed',
            }));
          }
        });
      });

      form = document.createElement('form');
      form.action = '/success';
      form.method = 'post';

      const input = document.createElement('input');
      input.name = 'foo';
      input.value = 'bar';
      form.appendChild(input);
    });

    afterEach(() => {
      window.fetch = oldFetch;
    });

    describe("when the form uses the get method", () => {
      pit("appends the form data to the query string", () => {
        return new Promise(resolve => {
          window.fetch = (request) => {
            if (request.url === form.action + '?foo=bar') {
              resolve();
            }

            return new Promise(resolve => {
              resolve(new Response('', {
                status: 200,
                statusText: 'OK',
                ok: true,
              }));
            });
          };

          form.method = 'get';

          asyncForm(form);
        });
      });
    });

    pit("dispatches a \"submitting\" custom event", () => {
      return new Promise(resolve => {
        form.addEventListener('submitting.asyncForm', event => {
          resolve(event);
        });

        asyncForm(form);
      })
        .then(event => {
          return new Promise(resolve => {
            if (event.detail.request && event.detail.request.url) {
              resolve();
            }
          });
        });
    });

    pit("dispatches a \"submitted\" custom event if the request succeeded", () => {
      return new Promise(resolve => {
        form.addEventListener('submitted.asyncForm', event => {
          resolve(event);
        });

        asyncForm(form);
      })
        .then(event => {
          return new Promise(resolve => {
            if (event.detail.response && event.detail.response.ok) {
              resolve();
            }
          });
        });
    });

    pit("dispatches a \"success\" custom event if the response is successful", () => {
      return new Promise(resolve => {
        form.addEventListener('success.asyncForm', event => {
          resolve(event);
        });

        asyncForm(form);
      })
        .then(event => {
          return new Promise(resolve => {
            if (event.detail.response && event.detail.response.ok) {
              resolve();
            }
          });
        });
    });

    pit("dispatches a \"fail\" custom event if the response is successful", () => {
      return new Promise(resolve => {
        form.addEventListener('fail.asyncForm', event => {
          resolve(event);
        });

        form.action = '/fail';
        asyncForm(form);
      })
        .then(event => {
          return new Promise(resolve => {
            if (event.detail.response && !event.detail.response.ok) {
              resolve();
            }
          });
        });
    });

    pit("dispatches an \"error\" custom event if the request failed", () => {
      return new Promise(resolve => {
        window.fetch = () => {
          return new Promise((resolve, reject) => {
            reject();
          });
        };

        form.addEventListener('error.asyncForm', resolve);

        asyncForm(form);
      });
    });
  });

  describe("when passing a non-form", () => {
    it("throws an error", () => {
      expect(asyncForm.bind(undefined, undefined)).toThrow();
      expect(asyncForm.bind(undefined, null)).toThrow();
      expect(asyncForm.bind(undefined, 13)).toThrow();
      expect(asyncForm.bind(undefined, 'uh oh')).toThrow();
      expect(asyncForm.bind(undefined, {})).toThrow();
      expect(asyncForm.bind(undefined, document.createElement('div'))).toThrow();
    });
  })
});
