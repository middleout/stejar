<p align="center">
  <a href="https://github.com/middleout/stejar">
    <img alt="react-router" src="https://s3-eu-west-1.amazonaws.com/stejar/stejar-logo.png" width="144">
  </a>
</p>

<h3 align="center">
	Stejar DI
</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@stejar/di"><img src="https://img.shields.io/npm/v/@stejar/di.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@stejar/di"><img src="https://img.shields.io/npm/dm/@stejar/di.svg?style=flat-square"></a>
</p>

<p align="center">
  Dependency Injection for React/Typescript applications.
</p>

## Autowiring

Type-hint your constructor parameters and the container can guess which dependencies to inject.

```js
class Foo
{
    private bar;

    constructor(bar: Bar)
    {
        this.bar = bar;
    }
}

```

## Simple usage

```js
// Just create the container and you are good to go thanks to autowiring.
const sm  = new ServiceManager();
const foo = sm.get(Foo);

// You can also define services à la Pimple:
sm.set('foo', new Foo(options));

sm.set(Logger, () => {
    logger = new Logger();
    logger.configure(options);
    return logger;
});

const foo = sm.get(Foo);
const logger = sm.get(Logger);
```

## Powerful container API

Stejar DI provides the classic API of a container as well as advanced features useful to build or extend a framework.

### GET & HAS
```js
sm.get($name);
sm.has($name);
```

### INSTANTIATE
```js
// Missing constructor parameters will be resolved from the container.
sm.instantiate(Foo);
```

## Motivation

Dependency Injection (DI) is a software design pattern that deals with how components get hold of their dependencies.

The Stejar injector system is in charge of creating objects, resolving their dependencies, and providing them to other objects as requested.

It is built using Typescript and it is meant to be used in a Typescript system.

@Stejar/DI helps you manage complex dependencies graph by provide you with an IoC container.


## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save @stejar/di

Using [yarn](https://yarnpkg.com/en/):

    $ yarn add @stejar/di

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using an ES6 transpiler, like babel
import { ServiceManager, injectable } from "@stejar/di";

// not using an ES6 transpiler
var ServiceManager = require("@stejar/di").ServiceManager;
var injectable = require("@stejar/di").injectable;
```

## Usage

1. Import the library:
```js
import { ServiceManager, injectable } from "@stejar/di";
```

2. Define a class that requires in its constructor another class:

```js
@injectable
class ChildClass {
    constructor() { console.log('Child class constructed'); }
}

@injectable
class ParentClass {
    constructor(public theChildClass: ChildClass) { console.log('Parent class constructed'); }
}
```

3. Create a service manager object

```js
const serviceManager = new ServiceManager();
```

3. Request an instance of the Parent class

```js
const parent = serviceManager.get(ParentClass);

// You should now see in the console the message "Child class constructed" then "Parent class constructed"
```

**NOTE** The ***@injectable*** decorator is required due to how the Typescript decorates classes. In order to *know* that a certain class needs dependencies of a *certain* type, typescript annotates the class with metadata (using the reflect-medata package) regarding those types. If you would bypass this decorator, Typescript would not know how to construct your class and an Error would be thrown.



## API

### ServiceManager

#### `set(resource, instance)`

Sets an instance of an object to a certain identifier. Returns the ServiceManager so that it can be chained with other methods.

```js
import { ServiceManager } from "@stejar/di";
import {Bar} from "./Bar";

const sm = new ServiceManager();

sm.set("foo", "ABC");
sm.set("bar", new Bar());
sm.set(Bar, new Bar()); // it will assume the Function.name as the key, in this case "Bar.name" => "Bar"

// Finally, it will generate the following container
// {
//   "ServiceManager": [self reference],
//   "foo": "ABC",
//   "bar": [instance of Bar #1]
//   "Bar": [instance of Bar #2]
// ]
```

#### `alias(to, from)`

Aliases a certain identifier to another identifier in order to substitute values under different names. Returns the ServiceManager so that it can be chained with other methods.

```js
import { ServiceManager } from "@stejar/di";

// Example #1

const sm = new ServiceManager();

sm.set("foo", "baz");
sm.alias("bar", "foo");

sm.get("bar"); // baz
```

```js
// Example #2
const sm = new ServiceManager();

class Foo {}

sm.set(Foo, "baz");
sm.alias("bar", Foo);

sm.get("bar"); // baz
```

```js
// Example #3
const sm = new ServiceManager();

class Foo {}
const foo = new Foo();

sm.set(Foo, foo);
sm.alias("bar", Foo);

sm.get("bar"); // "foo" constant as an certain instance of "Foo"
```

```js
// Example #4
const sm = new ServiceManager();

class Foo {}
class Bar {}

const foo = new Foo();

sm.set(Foo, foo);
sm.alias(Bar, Foo);

sm.get(Bar); // "foo" constant as an certain instance of "Foo"

```

#### `bindToMethod(methodName, resource)`

Allows "setter" injection for a certain alias name, instance of class name.
Normally used when constructor injection is not possible or needed. Returns the ServiceManager so that it can be chained with other methods.

```js
import { ServiceManager } from "@stejar/di";

const sm = new ServiceManager();

sm.set("bar", "baz");
sm.bindToMethod("setBar", "bar");

@injectable
class Foo {
    private bar: string;

    setBar(bar: string): this {
    	this.bar = bar;
        return this;
    }

    getBar() {
    	return this.bar;
    }
}

sm.get(Foo).getBar(); // baz
```

#### `factory(...factoryFunctions)`

Allows you to define a function (or functions) that are run imediatly, receiving a single argument: the Service Manager. Returns the ServiceManager so that it can be chained with other methods.

```js
const sm = new ServiceManager();

const factory1 = (serviceManager: ServiceManager) => {
    serviceManager.set("foo", "bar");
};
const factory2 = (serviceManager: ServiceManager) => {
    serviceManager.set("abc", "xyz");
};

sm.factory(factory1, factory2);

sm.get("foo"); //bar
sm.get("abc"); // xyz
```

#### `provide(resource, providerCallback)`

Defines a callback function to be run when asking for a certain resource. THe callback function is run only once and the result is saved & shared for that particular resource. The callback receives a single argument - the service manager - and must return anything (a truthy value). Returns the ServiceManager so that it can be chained with other methods.

```js
const sm = new ServiceManager();

class Foo {}

sm.provide(Foo, () => {
    return "bar";
});

sm.get(Foo); //bar
```

#### `provider(...providers)`

Similar to the provide API, the providers are classes that allow you to build an object for a given identifier based on certain rules. Returns the ServiceManager so that it can be chained with other methods.

```js
import {ServiceManager, AbstractProvider} from "@stejar/di";

const sm = new ServiceManager();

interface IFoo {
    foo(): string;
}
class Bar implements IFoo {
    foo() {
        return "Baz";
    }
}

class FooProvider extends AbstractProvider<IFoo> {
    provides() {
        return "IFoo";
    }

    provide(serviceManager: ServiceManager): IFoo {
        return new Bar();
    }
}

sm.provider(FooProvider);

sm.get("IFoo")); // Bar
sm.get("IFoo").foo()); // Baz
```

#### `get(resource)`

Allows the Service Manager to return values from the container. Accepts strings or classes. Returns the instance associated to the resource.

```js
const sm = new ServiceManager();

sm.set("foo", "bar");

sm.get("foo")); // bar
```

#### `instantiate(resource)`

Allows the Service Manager to instantiate a certain class. It builds (or reuses) all the dependencies of the resource, deeply. Also applies all "method" bindings (setter injection) before returning the actual instance. Does not store the instance in the container nor does it do anything with it. This method should mostly be avoided and the "get" API should be used instead. This method does *not* reuse instances.

```js
const sm = new ServiceManager();

class Foo {}

const foo1 = sm.instantiate(Foo); // Foo
const foo2 = sm.instantiate(Foo); // Foo
foo1 === foo2; // False
```


### AbstractProvider

This class is simple abstraction to extend from in order to tell the Service Manager how to construct a certain object. 

#### `abstract provides()`

Returns the class or class name (or a string) of the type of object it will provide.

#### `abstract provide(serviceManager)`

Should return the actual object indicated by the "provides" API. Receives the service manager instance. The system will automatically "bind" in the service manager (the key is indicated by the provides method).

```js
import { AbstractProvider, ServiceManager } from "@stejar/di";

const sm = new ServiceManager();

class Foo {}

class FooProvider extends AbstractProvider<Foo> {
    provides() {
        return Foo.name;
    }

    provide(serviceManager: ServiceManager): Foo {
        return new Foo();
    }
}

sm.provider(FooProvider); 

// Foo has NOT been instantiated yet

sm.get(Foo); // Foo has been instantiated and the instance is shared
sm.get(Foo); // Same instance as before
```

### @injectable

This function (decorator) is used strictly to force Typescript to append its decorator metadata. In case you are using other decorators already in your classes, you do not need to use this decorator at all

