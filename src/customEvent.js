'use strict';

const CustomEventPolyfill = require('custom-event');

function isCustomEventAvailable() {
  if (!CustomEvent) {
    return false;
  }

  try {
    new CustomEvent('garbage');
  } catch (e) {
    return false;
  }

  return true;
}

module.exports = function createCustomEvent() {
  let CustomEvent = window.CustomEvent;

  if (!isCustomEventAvailable()) {
    CustomEvent = CustomEventPolyfill;
  }

  return new CustomEvent(arguments[0], arguments[1]);
}
