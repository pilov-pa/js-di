let DI = require('../dist/index').default;
const assert = require('chai').assert;

describe("js-di", function () {
    describe("add", function () {
        it("add class", function () {
            class Foo {
            }
            const di = new DI();
            di.add("foo", Foo);
            const resolved = di.resolve("foo");
            assert.equal(Foo.prototype.isPrototypeOf(resolved), true);
        });

        it("add scalar", function() {
            const di = new DI();
            di.add("foo", "String");
            const resolved = di.resolve("foo");
            assert.equal(resolved, "String");
        });

        it("add not shared", function() {
            let v = 0;
            class Foo {
                constructor()
                {
                    v++;
                    this.c = v;
                }
            }
            const di = new DI();
            di.add("foo", Foo, [], false);
            const resolved1 = di.resolve("foo");
            const resolved2 = di.resolve("foo");

            assert.notEqual(resolved1.c, resolved2.c);
        });
        it("add shared", function() {
            let v = 0;
            class Foo {
                static v = 0;
                constructor()
                {
                    v++;
                    this.c = v;
                }
            }
            const di = new DI();
            di.add("foo", Foo, []);
            const resolved1 = di.resolve("foo");
            const resolved2 = di.resolve("foo");

            assert.equal(resolved1.c, resolved2.c);
        });
    });

    describe("resolve", function() {
        it("resolve service not found", function() {
            const di = new DI();

            function resolve() {
                const resolved = di.resolve("foo");
            }
            assert.throws(resolve, "Service 'foo' not found");
        })
    });

    describe("integration", function() {
        it("js-di", function () {
            class Foo {
                constructor(bar) {
                    this.bar = bar;
                }

                getBarName() {
                    return this.bar.name;
                }
            }

            class Bar {
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
});
