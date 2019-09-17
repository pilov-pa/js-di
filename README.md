# js-di
This is a pretty simple DI-container for JavaScript.
```
import DI from "simple-js-di";

class Foo
{
    bar = null;
    constructor(bar) {
        this.bar = bar;
    }

    getBarName() {
        return this.bar.name;
    }
}

class Bar
{
    name = null;
    constructor(name) {
        this.name = name;
    }
}

let di = new DI();
di.add("foo", Foo, ["bar"]);
di.add("bar", Bar, ["bar_name"]);
di.add("bar_name", "Bar name!");
const foo = di.resolve("foo");

console.log(foo.getBarName()); // Bar name!
```

Using method `add()`
================
Adds new dependency to the container.

Method `add()` has 4 arguments:
* name - the dependency alias
* value - classname or value
* dependencies - array of aliases for dependencies
* shared

Argument `name`
---------------
This is an alias of the dependency that you should use to resolve it.

Argument `value`
---------------
This argument can be a class or a value. If it is a class then resolving returns the result of calls the class constructor.

Argument `dependencies`
---------------
This argument is array of class dependencies. All dependencies should be registred in the di-container. Default the empty array.

Argument `shared`
---------------
If this argument is false, each  resolving will return a new instanse of the class. If this argument is true, only the first resolving will create a new instance, the next calls will use the alredy created instance. Default true.

Using method `resolve()`
================
Resolving the dependency by the name. All subdependencies will be resolved automatically if necessary.

Method has only one argument: name.
