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
    parameters = {};

    add(name, className, args = [], shared = true) {
        if (this.services.hasOwnProperty(name)) {
            throw new Error("Service '" + name + "' already exists");
        }

        if (!(typeof className === 'function')) {
            throw new Error("Parameter 'className' should be a class constructor");
        }

        this.services[name] = new Service(name, className, args, shared);
    }

    remove(name) {
        if (typeof this.services[name] === 'undefined') {
            throw new Error("Service '" + name + "' not found");
        }

        delete this.services[name];
    }

    has(name) {
        return !(typeof this.services[name] === 'undefined');
    }

    addParameters(parameters) {
        for (let parameterName in parameters) {
            if (this.parameters.hasOwnProperty(parameterName)) {
                throw new Error("Parameter '" + parameterName + "' already exists");
            }
            this.parameters[parameterName] = parameters[parameterName];
        }
    }

    getParameter(parameterName) {
        if (!this.parameters.hasOwnProperty(parameterName)) {
            throw new Error("Parameter '" + parameterName + "' not found");
        }

        return this.parameters[parameterName];
    }

    removeParameter(parameterName) {
        if (!this.parameters.hasOwnProperty(parameterName)) {
            throw new Error("Parameter '" + parameterName + "' not found");
        }

        delete this.parameters[parameterName];
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
                let resolvedArg;
                if (arg.indexOf('@') === 0) {
                    const processedArgName = arg.substring(1);

                    if (!this.parameters.hasOwnProperty(processedArgName)) {
                        throw new Error("Parameter '" + processedArgName + "' not found");
                    }

                    resolvedArg = this.parameters[processedArgName];
                } else {
                    resolvedArg = this.resolve(arg);
                }
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
