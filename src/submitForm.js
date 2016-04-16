/**
 * @module submitForm
 */
'use strict';

require('whatwg-fetch');

const CustomEvent = require('custom-event');
const getFormData = require('get-form-data');
const queryString = require('query-string');

/**
 * Dispatches a custom event on the specified form element.
 *
 * @param  {HTMLFormElement} form
 * @param  {String} type     event type name
 * @param  {Object} init     event init object
 * @return {boolean}         true if the event was canceled
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @private
 */
function dispatchFormEvent(form, type, init) {
  init = init || {};

  const event = new CustomEvent(type, Object.assign({
    bubbles: true,
  }, init));

  return form.dispatchEvent(event);
}

/**
 * Generates a Fetch API Request object based on the provided form element.
 *
 * @param  {HTMLFormElement} formElement
 * @return {Request}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 * @private
 */
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

/**
 * Dispatch events after a successful AJAX form submission.
 *
 * @param  {Response} response
 * @this   {HTMLFormElement}   the form being submitted
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
 * @private
 */
function dispatchSuccessfulEvents(response) {
  dispatchFormEvent(this, 'submitted.asyncForm', {
    detail: {
      response: response,
    },
  });

  if (response.ok) {
    dispatchFormEvent(this, 'success.asyncForm', {
      detail: {
        response: response,
      },
    });
  } else {
    dispatchFormEvent(this, 'fail.asyncForm', {
      detail: {
        response: response,
      },
    });
  }
}

/**
 * Dispatch events after a failed AJAX form submission.
 *
 * @this {HTMLFormElement} the form being submitted
 * @private
 */
function dispatchUnsuccessfulEvents() {
  dispatchFormEvent(this, 'error.asyncForm');
}

/**
 * Submits a form via AJAX.
 *
 * @param  {HTMLFormElement} formElement
 * @public
 */
module.exports = function submitAsyncForm(formElement) {
  const request = createRequest(formElement);

  const canceled = !dispatchFormEvent(formElement, 'submitting.asyncForm', {
    cancelable: true,
    detail: {
      request: request,
    },
  });

  if (canceled) {
    return;
  }

  fetch(request)
    .then(dispatchSuccessfulEvents.bind(formElement))
    .catch(dispatchUnsuccessfulEvents.bind(formElement));
};
