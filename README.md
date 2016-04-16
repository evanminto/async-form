# async-form v0.2.1

Transforms normal HTML forms into asynchronous forms, replacing normal submission with a AJAX requests.

## How to Use
The module exposes a function "asyncForm" that accepts various arguments representing a form or forms that should be turned into asynchronous forms. Once the function initializes the form, all subsequent [submit events](https://developer.mozilla.org/en-US/docs/Web/Events/submit) on the form will result in AJAX calls instead of normal form submissions. The method, action, and other parameters are determined by the properties of the form element and its children.

**NOTE:** Calling the native [HTMLFormElement.submit()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit) method does not trigger the submit event, so that function will still trigger a normal, synchronous submission.

### Node
```js
  const asyncForm = require('@evanminto/async-form'); // Not published to NPM yet!

  asyncForm(document.querySelector('#my_form'));
  asyncForm(document.querySelectorAll('.my-form'));
  asyncForm('.my-form');
```

### Browser
```js
  window.asyncForm(document.querySelector('#my_form'));
  window.asyncForm(document.querySelectorAll('.my-form'));
  window.asyncForm('.my-form');
```

## Functions
### asyncForm(target)
`target` is one of the following:
  * **HTMLFormElement:** a form element
  * **NodeList:** a list of form elements
  * **String:** a CSS selector representing one or many form elements
