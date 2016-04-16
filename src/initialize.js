/**
 * @module initialize
 */
'use strict';

const matches = require('matches-selector');

const submitForm = require('./submitForm');

/**
 * Prevents default, synchronous submission and submits via AJAX.
 *
 * @param  {Event} event
 * @private
 */
function handleSubmit(event) {
  event.preventDefault();

  submitForm(event.target);
}

/**
 * Takes a single form element and transforms it into an asynchronous form.
 *
 * @param  {HTMLFormElement} formElement
 * @private
 */
function initializeForSingleElement(formElement) {
  formElement.addEventListener('submit', handleSubmit);
}

/**
 * Takes a NodeList of form elements and transforms each one into an asynchronous form.
 *
 * @param  {NodeList} formElements
 * @private
 */
function initializeForCollection(formElements) {
  const formElementsLen = formElements.length;

  for (let i = 0; i < formElementsLen; i++) {
    initializeForSingleElement(formElements[i]);
  }
}

/**
 * Takes a CSS selector representing some number of form elements and
 * transforms each one into an asynchronous form.
 *
 * @param  {String} selector   a CSS selector
 * @private
 */
function initializeForSelector(selector) {
  document.addEventListener('submit', event => {
    if (matches(event.target, selector)) {
      handleSubmit(event);
    }
  });
}

/**
 * Takes a target (either a form element, a list of form elements, or a CSS selector)
 * and transforms each form that it represents into an asynchronous form.
 *
 * @param  {HTMLFormElement|NodeList|String} target
 * @public
 */
module.exports = function initialize(target) {
  if (target instanceof HTMLFormElement) {
    initializeForSingleElement(target);
  } else if (target instanceof NodeList) {
    initializeForCollection(target);
  } else if (typeof target === 'string') {
    initializeForSelector(target);
  } else {
    throw 'First argument must be an HTMLFormElement, NodeList, or string.';
  }
};
