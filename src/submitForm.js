'use strict';

require('whatwg-fetch');

const CustomEvent = require('custom-event');
const getFormData = require('get-form-data');
const queryString = require('query-string');

function dispatchFormEvent(form, type, detail) {
  detail = detail || {};
  const event = new CustomEvent(type, {
    detail,
    bubbles: true,
  });

  form.dispatchEvent(event);
}

function createRequest(formElement) {
  let url = formElement.action;
  let body;

  if (formElement.method.toLowerCase() === 'get') {
    url += '?' + queryString.stringify(getFormData(formElement));
  } else {
    body = new FormData(formElement);
  }

  return new Request(url, {
    body,
    method: formElement.method,
  });
}

module.exports = function submitAsyncForm(formElement) {
  const request = createRequest(formElement);

  dispatchFormEvent(formElement, 'submitting.asyncForm', {
    request: request,
  });

  fetch(request)
    .then(response => {
      dispatchFormEvent(formElement, 'submitted.asyncForm', {
        response: response,
      });

      if (response.ok) {
        dispatchFormEvent(formElement, 'success.asyncForm', {
          response: response,
        });
      } else {
        dispatchFormEvent(formElement, 'fail.asyncForm', {
          response: response,
        });
      }
    })
    .catch(() => dispatchFormEvent(formElement, 'error.asyncForm'));
};
