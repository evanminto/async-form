'use strict';

const matches = require('matches-selector');

const asyncForm = require('./asyncForm');

function handleSubmit(event) {
  event.preventDefault();

  asyncForm(event.target);
}

function initializeForSingleElement(formElement) {
  formElement.addEventListener('submit', handleSubmit);
}

function initializeForCollection(formElements) {
  const formElementsLen = formElements.length;

  for (let i = 0; i < formElementsLen; i++) {
    formElements[i].addEventListener('submit', handleSubmit);
  }
}

function initializeForSelector(selector) {
  document.addEventListener('submit', event => {
    if (matches(event.target, selector)) {
      handleSubmit(event);
    }
  });
}

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
