let DI = require('../dist/index').default;
const assert = require('chai').assert;

describe("js-di", function() {
    it("js-di", function() {
        class Foo
        {
            constructor(bar) {
                this.bar = bar;
            }

            getBarName() {
                return this.bar.name;
            }
        }

        class Bar
        {
            constructor(name) {
                this.name = name;
            }
        }

        let di = new DI();
        di.add("foo", Foo, ["bar"]);
        di.add("bar", Bar, ["bar_name"]);
        di.add("bar_name", "Bar name!");
        const foo = di.resolve("foo");
        assert.equal(foo.getBarName(), 'Bar name!');
    })
});
