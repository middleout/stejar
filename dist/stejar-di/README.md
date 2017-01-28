# stejar-di
Stejar Dependency Injection / Service Manager

## Table of Contents

- [Dependency Injection](#Dependency Injection)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Best Practices](#bestpractices)
- [API](#api)
- [License](#license)

# Dependency Injection

Dependency Injection (DI) is a software design pattern that deals with how components get hold of their dependencies.

The Stejar injector system is in charge of creating objects, resolving their dependencies, and providing them to other objects as requested.

It is built using Typescript and it is meant to be used in a Typescript system.

# Installation

`npm install --save stejar-di`.

## Quick Start

`stejar-di` helps you manage complex dependencies graph by provide you with an IoC container.

- install with `npm install stejar-di`
- import or require `ServiceManager` and `injectable` by
```js

//es5
var ServiceManager = require('stejar-di').ServiceManager;
var injectable = require('stejar-di').injectable;

//es6
import { ServiceManager, injectable } from 'stejar-di';

```

- Define a class that requires in its constructor another class:
```js

@injectable
class AnotherExample {}

@injectable
class ExampleWithDep {
    constructor(someValue: AnotherExample) {}
}
```

- Then create a service manager object and request either classes. These will get instantiated once and that's it.

```js

const serviceManager = new ServiceManager();
console.log(serviceManager.get(ExampleWithDep));

// or
const serviceManager = new ServiceManager();
serviceManager.bind('someKey', new ExampleWithDep(new AnotherExample());
console.log(serviceManager.get(ExampleWithDep)); // returns a NEW instance of the ExampleWithDeb as well as saving it under the name "ExampleWithDep"
console.log(serviceManager.get('someKey')); // returns the binded instance
```

- The library can also be used to namespace classes as following:

 ```js

 import {namespace, ServiceManager} from "stejar-di";

 @namespace('My/Cool/Package')
 class ExampleClass {}

 const serviceManager = new ServiceManager();
 console.log(serviceManager.get(ExampleClass)); // instantiate and returns the instance but also saves the reference unde the name "My/Cool/Package/ExampleClass"

 // This allows you to do the following:

 // example1.js
 @namespace('Foo/Package')
 export class ExampleClass {}

 // example2.js
 @namespace('Bar/Package')
 export class ExampleClass {}

 // index.js
 import {ServiceManager} from "stejar-di";
 import {ExampleClass as FooExample} from "./example1.js"
 import {ExampleClass as BarExample} from "./example2.js"

 const serviceManager = new ServiceManager();
 console.log(serviceManager.get(FooExample)); // new Foo/Package/ExampleClass
 console.log(serviceManager.get(BarExample)); // new Bar/Package/ExampleClass

 ```

 - If you ever need to retrieve the FQDN of the class (aka Namespace + Name) then you can do the following:

 ```js

 import {getNamespacedName} from "stejar-di";
 import {SomeClassInAPackage} from "./some-class-file";

 console.log(getNamespacedName(SomeClassInAPackage)); // will print either "SomeClassInAPackage" if no namespace is present or "[namespace_you_provided]/SomeClassInAPackage" if you provided a @namespace.

 ```

[THE DOCUMENTATION IS STILL A WORK IN PROGRESS...]
