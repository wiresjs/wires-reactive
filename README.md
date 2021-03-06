[![Build Status](https://travis-ci.org/wiresjs/wires-reactive.svg?branch=master)](https://travis-ci.org/wiresjs/wires-reactive)
# Wires Reactive

A unique library that watches string template changes and provides a very helpful toolset for watching javascript
objects.
It combines 3 libraries:
 * async-watch (to watch variables asynchronously)
 * extract-vars (to extract watchable variables)
 * wires-angular-expressions

```
import {Watch} from "wires-reactive";
let context = { scope: { user: { name: "Bob" }}}
Watch.template(context, "Hello {{user.name}}!", (str) => {
   // Hello Bob!
});
```

[TRY IT LIVE](https://plnkr.co/edit/fJFUrCs1577aFMlAVhtX?p=preview)

## How it works
wires-reactive uses [async-watch](https://github.com/wiresjs/async-watch/), which adds
a very unique and efficient feature to the browser - triggers changes when the browser is actually ready
to paint. If you are not familiar with it yet - go ahead, and check it out, this micro solution is unique.

We extract variables from an expression using a very  efficient library
[extract-vars](https://github.com/wiresjs/extract-vars)
It costs nothing for the browser - non RegEx approach and a tiny size. Besides you can precompile your templates beforehand!
Interested how it works> Check a very simple and comprehensive [test suite](https://github.com/wiresjs/extract-vars/blob/master/test/main.js#L4)!

We evaluate expressions using angular-expression. Which, unfortunately, is the only options for now.
(It understands locals, others - don't)


## Features

* Template expression watch
* Expression watch (will trigger changes when affected variable is changed)
* Automatically extracts variables from expressions (intelligent and smart enough to extract only variables that can be possible watched)
* Written in typescript

## Install

```bash
npm install wires-reactive
```

If you want to have it in browser, you have to use your own build, or use include universal files.


*inpatient to try it out*? clone this repository and just run `gulp test-build` and open `.browser-test-helper/test.html` in you favourite browser!

## Watch.template

Watches a template, precompiles if necessary. You can pass locals to the context as well.
```js
let context = {
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
Please not, that any synchronous call within the current trick won't trigger anything. This behaviour is intentional.

### procompileTemplate

In order to speed things up, you can precompile a template
```js
precompileString("Hello {{user.name}}! We love you {{user.name}}")
// Precompiled string:
// [ 'Hello ', [ 'user.name', [ 'user.name' ] ], ', we love you ', [ 'user.name', [ 'user.name' ] ] ]
```

## Watch.expression
Watches an expression, `context` is the same, should consist of scope and locals (optional)
```js
Watch.expression(context, "{ active : user.name === 'Bob' }", function(result) {
    // {active : true}
});
```

### precompileExpression
Precompile your expressions to make it blazing fast!
```js
precompileExpression("{ active : user.name === 'Bob'"})
```

I you like this idea, please, don't forget to star the repository.
If you think that JSX is *the worst* what happened to web development, contact me personally via `window.atob("c2t5cGU6bmNoYW5nZWQ=")`, i'll buy you a beer.

Also, we have started a gitter channel (link above)
