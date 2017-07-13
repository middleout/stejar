<p align="center">
  <a href="https://github.com/middleout/stejar/tree/master/packages/packages/react-di">
    <img alt="packages/react-di" src="https://s3-eu-west-1.amazonaws.com/stejar/stejar-logo.png" width="144">
  </a>
</p>

<h3 align="center">
	Stejar React-DI
</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@stejar/packages/react-di"><img src="https://img.shields.io/npm/v/@stejar/packages/react-di.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@stejar/packages/react-di"><img src="https://img.shields.io/npm/dm/@stejar/packages/react-di.svg?style=flat-square"></a>
</p>

<p align="center">
  Official React bindings for Stejar DI
</p>

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save @stejar/react-di

Using [yarn](https://yarnpkg.com/en/):

    $ yarn add @stejar/react-di

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using an ES6 transpiler, like babel
import { ServiceProvider, inject, withServiceManager } from "@stejar/react-di";

// not using an ES6 transpiler
var ServiceProvider = require("@stejar/react-di").ServiceProvider;
var injectinjectable = require("@stejar/react-di").inject;
var withServiceManager = require("@stejar/react-di").withServiceManager;
```

## API

### ServiceProvider

### @inject

### @withServiceManager