# Container interface

This document describes a common interface for dependency injection containers.

The goal set by `ContainerInterface` is to standardize how frameworks and libraries make use of a
container to obtain objects and parameters (called _entries_ in the rest of this document).

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC 2119][].

The word `implementor` in this document is to be interpreted as someone
implementing the `ContainerInterface` in a dependency injection-related library or framework.
Users of dependency injection containers (DIC) are referred to as `user`.

[rfc 2119]: http://tools.ietf.org/html/rfc2119

## 1. Specification

### 1.1 Basics

#### 1.1.1 Entry identifiers

An entry identifier is any Javascript-legal string of at least one character that uniquely identifies an item within a container. An entry identifier is an opaque string, so callers SHOULD NOT assume that the structure of the string carries any semantic meaning.

#### 1.1.2 Reading from a container

*   The `ContainerInterface` exposes two methods: `get` and `has`.

*   `get` takes one mandatory parameter: an entry identifier, which MUST be a string.
    `get` can return anything (a _mixed_ value). Two successive calls to `get` with the same
    identifier SHOULD return the same value. However, depending on the `implementor`
    design and/or `user` configuration, different values might be returned, so
    `user` SHOULD NOT rely on getting the same value on 2 successive calls.

*   `has` takes one unique parameter: an entry identifier, which MUST be a string.
    `has` MUST return `true` if an entry identifier is known to the container and `false` if it is not.
    If `has(id)` returns false, `get(id)` MAY throw an `Error`. The reason `get(id)` does not always
    throw an error is because containers can be configured to auto construct dependencies. So if a
    value is not in the container, calling get would generate it on the fly & MAY store it for future
    references.

### 1.2 Recommended usage

Users SHOULD NOT pass a container into an object so that the object can retrieve _its own dependencies_.
This means the container is used as a [Service Locator](https://en.wikipedia.org/wiki/Service_locator_pattern)
which is a pattern that is generally discouraged.

Please refer to section 4 of the META document for more details.

## 2. Package

Packages providing a container implementation should declare that they provide `TODO` `x.0.0`.

Projects requiring an implementation should require `TODO` `x.0.0`.

## 3. Interfaces

<a name="container-interface"></a>

### 3.1. `ContainerInterface`

```javascript
export default {
    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param mixed id Identifier of the entry to look for.
     *
     * @throws Error Error while retrieving the entry.
     *
     * @return mixed Entry.
     */
    get: function get(id) {},

    /**
     * Returns true if the container has an entry for the given identifier.
     * Returns false otherwise.
     *
     * `has(id)` returning false does not mean that `get(id)` will throw an exception.
     * `has(id)` returning false does not mean that `get(id)` will not be able to
     * create an instance of the resource .
     *
     * @param mixed id Identifier of the entry to look for.
     *
     * @return bool
     */
    has: function has(id) {},
};
```
