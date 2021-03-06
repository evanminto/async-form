'use strict';

let form;

jest.unmock('whatwg-fetch');
jest.unmock('../../src/submitForm');

jest.mock('custom-event', () => {
  return CustomEvent;
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

const submitForm = require('../../src/submitForm');

describe('submitForm', () => {
  it("is a function", () => {
    expect(submitForm).toBeDefined();
    expect(typeof submitForm).toEqual('function');
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

      form.dataset = {};
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

          submitForm(form);
        });
      });
    });

    pit("dispatches a \"submitting\" custom event", () => {
      return new Promise(resolve => {
        form.addEventListener('submitting.asyncForm', event => {
          resolve(event);
        });

        submitForm(form);
      })
        .then(event => {
          return new Promise(resolve => {
            if (event.detail.request && event.detail.request.url) {
              resolve();
            }
          });
        });
    });

    pit("does not submit if the \"submitting\" event is canceled", () => {
      return new Promise((resolve, reject) => {
        form.addEventListener('submitting.asyncForm', event => {
          event.preventDefault();
        });

        window.fetch = jest.fn().mockImpl(() => {
          reject();
        });

        submitForm(form);
        resolve();
      });
    });

    pit("dispatches a \"submitted\" custom event if the request succeeded", () => {
      return new Promise(resolve => {
        form.addEventListener('submitted.asyncForm', event => {
          resolve(event);
        });

        submitForm(form);
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

        submitForm(form);
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
        submitForm(form);
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

        submitForm(form);
      });
    });

    describe("when the form has the data-async-form-accept attribute set", () => {
      beforeEach(() => {
        form.dataset.asyncFormAccept = 'application/json';
      });

      pit("sends a request with the Accept header set based on the data attribute", () => {
        return new Promise(resolve => {
          form.addEventListener('submitting.asyncForm', event => {
            resolve(event);
          });

          submitForm(form);
        })
          .then(event => {
            return new Promise((resolve, reject) => {
              if (event.detail.request && event.detail.request.headers.get('Accept') === form.dataset.asyncFormAccept) {
                resolve();
              } else {
                reject();
              }
            });
          });
      });
    });

    describe("when the form has the data-async-form-credentials attribute set", () => {
      beforeEach(() => {
        form.dataset.asyncFormCredentials = 'same-origin';
      });

      pit("sends a request with the credentials property set based on the data attribute", () => {
        return new Promise(resolve => {
          form.addEventListener('submitting.asyncForm', event => {
            resolve(event);
          });

          submitForm(form);
        })
          .then(event => {
            return new Promise((resolve, reject) => {
              if (event.detail.request && event.detail.request.credentials === form.dataset.asyncFormCredentials) {
                resolve();
              } else {
                reject();
              }
            });
          });
      });
    });

    describe("when the form has the data-async-form-mode attribute set", () => {
      beforeEach(() => {
        form.dataset.asyncFormMode = 'same-origin';
      });

      pit("sends a request with the mode property set based on the data attribute", () => {
        return new Promise(resolve => {
          form.addEventListener('submitting.asyncForm', event => {
            resolve(event);
          });

          submitForm(form);
        })
          .then(event => {
            return new Promise((resolve, reject) => {
              if (event.detail.request && event.detail.request.mode === form.dataset.asyncFormMode) {
                resolve();
              } else {
                reject();
              }
            });
          });
      });
    });
  });

  describe("when passing a non-form", () => {
    it("throws an error", () => {
      expect(submitForm.bind(undefined, undefined)).toThrow();
      expect(submitForm.bind(undefined, null)).toThrow();
      expect(submitForm.bind(undefined, 13)).toThrow();
      expect(submitForm.bind(undefined, 'uh oh')).toThrow();
      expect(submitForm.bind(undefined, {})).toThrow();
      expect(submitForm.bind(undefined, document.createElement('div'))).toThrow();
    });
  })
});
