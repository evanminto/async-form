# async-form v0.2.2

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

## Events
During submission, the form dispatches a number of custom events representing different steps in the submission process. All events have an "asyncForm" namespace.

### error.asyncForm
**Cancelable:** *false*

Dispatches when the form has failed to send the AJAX request. This is usually because of network failure or some other fundamental problem.

### fail.asyncForm
**Detail Property Contains:** response (*[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)*)<br>
**Cancelable:** *false*

Dispatches when the form has finished sending the AJAX request and received a response outside of the successful 200 range of status codes.

### submitted.asyncForm
**Detail Property Contains:** response (*[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)*)<br>
**Cancelable:** *false*

Dispatches when the form has finished sending the AJAX request and received a response (regardless of the status code of the response).

### submitting.asyncForm
**Detail Property Contains:** request (*[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)*)<br>
**Cancelable:** *true*

Dispatched when the form is about to send the AJAX request. If canceled, the form does not send the request.

### success.asyncForm
**Detail Property Contains:** response (*[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)*)<br>
**Cancelable:** *false*

Dispatches when the form has finished sending the AJAX request and received a response with a successful (&gt;= 200, &lt; 300) status code.
