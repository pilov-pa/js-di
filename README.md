[![Build Status](https://travis-ci.org/pilov-pa/js-di.svg?branch=master)](https://travis-ci.org/pilov-pa/js-di)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/pilov-pa/js-di) 
![GitHub last commit](https://img.shields.io/github/last-commit/pilov-pa/js-di)
![NPM](https://img.shields.io/npm/l/simple-js-di)
# js-di
This is a pretty simple DI-container for ES6.
## Install

```
$ npm install simple-js-di
```

## Example

```javascript
import DI from "simple-js-di";

class Foo
{
    bar = null;
    constructor(bar) {
        this.bar = bar;
    }

    getGreeting() {
        return this.bar.greeting + ', ' + this.bar.name + '!';
    }
}

class Bar
{
    name = null;
    greeting = null;
    constructor(greeting, name) {
        this.greeting = greeting;
        this.name = name;
    }
}

let di = new DI();
di.add("foo", Foo, [":bar"]);
di.add("bar", Bar, ["Hello", "@name"]);
di.addParameters({
    'name': 'World',
});
const foo = di.resolve("foo");

console.log(foo.getGreeting()); // Hello, World!
```

## Api

- [`add(name, className, dependencies, shared)`](#using-method-addname-value-dependencies-shared)
- [`resolve(name)`](#using-method-resolvename)
- remove(name)
- has(name)
- addParameters(parameters)
- getParameter(parameterName)
- removeParameter(parameterName)

### Using method `add(name, value, dependencies, shared)`
Adds new dependency to the container.

##### Example
```js
di.add("someService", SomeServiceClass, [":anotherService", "@someParameter", 123], true);
```
or
```js
di.add({
    name: "someService", 
    class: SomeServiceClass, 
    args: [":anotherService", "@someParameter", 123], 
    shared: true,
    tags: ["tag1", "tag2"],
});
```

Method `add()` has 5 arguments:

#### Argument `name`
This is an alias of the dependency that you should use to resolve it.

#### Argument `className`

This argument can be a class or a value. If it is a class then resolving returns the result of calls the class constructor.

#### Argument `args`
This argument is array of service dependencies should be pass to service constructor.
All dependencies should be registered in the di-container. 
If dependency name has prefix `@` then dependency is parameter else is another service/
Default the empty array.

#### Argument `shared`
If this argument is false, each  resolving will return a new instance of the class. If this argument is true, only the first resolving will create a new instance, the next calls will use the alredy created instance. Default true.

#### Argument `tags`
Tags list. See [`getByTag()`](#using-method-getbytagtag)

### Using method `resolve(name)`
Resolving the dependency by the name. All subdependencies will be resolved automatically if necessary.

Method has only one argument: name.

### Using method `getByTag(tag)`
Get all services tagged by `tag`