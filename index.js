class Service {
    name;
    className;
    shared = true;
    args = [];
    compiled = null;

    constructor(name, className, args = [], shared = true)
    {
        this.shared = shared;
        this.name = name;
        this.className = className;
        this.args = args;
    }
}
export default class DI {
    services = {};

    add(name, className, args = [], shared = true) {
        console.log(typeof className);
        this.services[name] = new Service(name, className, args, shared);
    }

    resolve(name) {
        if (!this.services[name]) {
            throw new Error("Service '" + name + "' not found");
        }

        const service = this.services[name];

        if (typeof service.className === 'function') {

            if (service.shared && service.compiled !== null) {
                return service.compiled;
            }

            const args = service.args;
            let resolvedArgs = [];
            for (let arg of args) {
                let resolvedArg = this.resolve(arg);
                resolvedArgs.push(resolvedArg);
            }
            const className = service.className;
            const result = Reflect.construct(className, resolvedArgs);
            if (service.shared) {
                service.compiled = result;
            }
            return result;
        }

        return service.className;
    }
}
