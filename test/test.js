let DI = require('../dist/index').default;
const assert = require('chai').assert;

describe('js-di', function() {
    describe('add', function() {
        it('add class', function() {
            class Foo {}
            const di = new DI();
            di.add('foo', Foo);
            const resolved = di.resolve('foo');
            assert.equal(Foo.prototype.isPrototypeOf(resolved), true);
        });

        it('add already exists', function() {
            class Foo {}
            const di = new DI();
            di.add('foo', Foo);
            function add() {
                di.add('foo', Foo);
            }
            assert.throws(add, "Service 'foo' already exists");
        });

        it('add not shared', function() {
            let v = 0;
            class Foo {
                constructor() {
                    v++;
                    this.c = v;
                }
            }
            const di = new DI();
            di.add('foo', Foo, [], false);
            const resolved1 = di.resolve('foo');
            const resolved2 = di.resolve('foo');

            assert.notEqual(resolved1.c, resolved2.c);
        });
        it('add shared', function() {
            let v = 0;
            class Foo {
                static v = 0;
                constructor() {
                    v++;
                    this.c = v;
                }
            }
            const di = new DI();
            di.add('foo', Foo, []);
            const resolved1 = di.resolve('foo');
            const resolved2 = di.resolve('foo');

            assert.equal(resolved1.c, resolved2.c);
        });
        it('add init by object', function() {
            const di = new DI();
            di.add({
                name: 'name',
                class: class Foo {},
            });
        });
        it('add init by object already exists', function() {
            const di = new DI();
            di.add({
                name: 'name',
                class: class Foo {},
            });

            assert.throws(() => {
                di.add({
                    name: 'name',
                    class: class Foo {},
                });
            }, "Service 'name' already exists");
        });
    });

    describe('addMulti', function() {
        it('addMulti success', function() {
            const di = new DI();
            class Foo {}
            class Bar {}
            class Baz {}
            di.addMulti([
                {
                    name: 'name',
                    class: Foo,
                },
                {
                    name: 'test',
                    class: Bar,
                    arguments: [],
                },
                {
                    name: 'test2',
                    class: Baz,
                    arguments: [],
                    shared: false,
                },
            ]);

            assert.equal(Foo.prototype.isPrototypeOf(di.resolve('name')), true);
            assert.equal(Bar.prototype.isPrototypeOf(di.resolve('test')), true);
            assert.equal(Baz.prototype.isPrototypeOf(di.resolve('test2')), true);
        });
    });

    describe('addParameters', function() {
        it('addParameters', function() {
            const di = new DI();
            di.addParameters({
                foo: 'String',
                bar: 'Second string',
            });

            assert.equal(di.getParameter('foo'), 'String');
            assert.equal(di.getParameter('bar'), 'Second string');
        });
        it('addParameters already exists', function() {
            const di = new DI();
            di.addParameters({
                foo: 'String',
                bar: 'Second string',
            });
            function addParameters() {
                di.addParameters({
                    bar: 'Second string',
                });
            }
            assert.throws(addParameters, "Parameter 'bar' already exists");
        });
    });

    describe('removeParameter', function() {
        it('removeParameter success', function() {
            const di = new DI();
            di.addParameters({
                foo: 'String',
                bar: 'Second string',
            });

            di.removeParameter('foo');
            function getParameter() {
                di.getParameter('foo');
            }
            assert.throws(getParameter, "Parameter 'foo' not found");
        });

        it('removeParameter not found', function() {
            const di = new DI();

            function removeParameter() {
                di.removeParameter('foo');
            }
            assert.throws(removeParameter, "Parameter 'foo' not found");
        });
    });

    describe('resolve', function() {
        it('resolve service not found', function() {
            const di = new DI();

            function resolve() {
                const resolved = di.resolve('foo');
            }
            assert.throws(resolve, "Service 'foo' not found");
        });
    });

    describe('remove', function() {
        it('remove', function() {
            class Foo {}
            const di = new DI();
            di.add('foo', Foo);
            di.remove('foo');
            function resolve() {
                const resolved = di.resolve('foo');
            }
            assert.throws(resolve, "Service 'foo' not found");
        });

        it('remove not found', function() {
            const di = new DI();
            function remove() {
                di.remove('foo');
            }
            assert.throws(remove, "Service 'foo' not found");
        });
    });

    describe('has', function() {
        it('has true', function() {
            class Foo {}
            const di = new DI();
            di.add('foo', Foo);

            assert.equal(di.has('foo'), true);
        });

        it('has false', function() {
            const di = new DI();

            assert.equal(di.has('foo'), false);
        });
    });

    describe('integration', function() {
        it('js-di', function() {
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
            assert.equal(foo.getGreeting(), 'Hello, World!');
        });
    });

    describe('getByTag', function() {
        it('getByTag', function() {
            class Foo {
                name = 'foo';
            }
            class Bar {
                name = 'bar';
            }
            class Baz {
                name = 'baz';
            }
            let di = new DI();
            di.add('foo', Foo, [], true, ['test']);
            di.add('bar', Bar, [], true);
            di.add('baz', Baz, [], true, ['test']);

            const services = di.getByTag('test');

            assert.lengthOf(services, 2);

            assert.equal(services[0].name, 'foo');
            assert.equal(services[1].name, 'baz');
        });
    });
});
