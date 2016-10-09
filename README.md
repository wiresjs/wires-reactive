[![Build Status](https://travis-ci.org/wiresjs/wires-reactive.svg?branch=master)](https://travis-ci.org/wiresjs/wires-reactive)
# Wires Reactive

A unique library that watches string template changes and provides a very helpful toolset for watching javascript objects.
Combines async-watch, wires-angular-expressions, and extract-vars

## Features

* Template expression watch
* Expression watch (will trigger changes when affected variable is changed)
* Automatically extracts variables from expressions (intellegent and smart enough to extract only variables that can be possible watched)
* Written in typescript

## Install

```bash
npm install wires-reactive
```

If you want to have it in browser, you have to use your own build, or use a universal build.
```html
<script src="node_modules/extract-vars/dist/dist.min.js"></script>
<script src="node_modules/wires-angular-expressions/src/index.js"></script>
<script src="node_modules/async-watch/dist/async-watch.js"></script>
<!-- Current library -->
<script src="wires-reactive-es5.js"></script>
```

## Watch.template

Watches a template, precompiles it if necessary
```js
var context = {
    scope: {
        user: {
            name: "Bob"
        }
    }
}
Watch.template(context, "Hello {{user.name}}! We love you {{user.name}}", (str) => {
   // Hello Bob! We love you Bob
});
```

Any asynchronous change will trigger a callback. For example
```js
setTimeout(()=> {
  context.scope.user.name = "Richard";
},1)
```

