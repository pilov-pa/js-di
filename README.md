# js-di
This is a pretty simple DI-container for JavaScript.
```
import DI from "simple-js-di";

class Foo
{
  bar = null;
  construct(bar) {
    this.bar = bar;
  }
  
  getBarName() {
    return bar.name;
  }
}

class Bar
{
  name = null;
  construct(name) {
    this.name = name;
  }
}

let di = new DI();
di.add("foo", Foo, ["bar"]);
di.add("bar", Bar, ["bar_name"]);
di.add("bar_name", "Bar name!");

const foo = di.resolve("foo");
console.log(foo.getBarName); // Bar name!
```
