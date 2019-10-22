export default class DI {
    services = {};

    parameters = {};

    add(name, className, args = [], shared = true, tags = []) {
        if (typeof name === 'object') {
            if (this.services.hasOwnProperty(name.name)) {
                throw new Error("Service '" + name.name + "' already exists");
            }

            this.services[name.name] = {
                name: name.name,
                className: name.class,
                args: name.args,
                shared: name.shared,
                tags: name.tags,
                compiled: null,
            };
        } else {
            if (this.services.hasOwnProperty(name)) {
                throw new Error("Service '" + name + "' already exists");
            }

            if (!(typeof className === 'function')) {
                throw new Error("Parameter 'className' should be a class constructor");
            }

            this.services[name] = {
                name: name,
                className: className,
                args: args,
                shared: shared,
                tags: tags,
                compiled: null,
            };
        }
    }

    addMulti(config) {
        if (!Array.isArray(config)) {
            throw new Error('Config should be an array');
        }
        for (const serviceConfig of config) {
            this.add(serviceConfig);
        }
    }

    getByTag(tag) {
        let result = [];
        for (const serviceName in this.services) {
            const service = this.services[serviceName];
            if (service.tags.indexOf(tag) !== -1) {
                result.push(this.resolve(serviceName));
            }
        }
        return result;
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

    hasParameter(parameterName) {
        return this.parameters.hasOwnProperty(parameterName);
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

        if (service.shared && service.compiled !== null) {
            return service.compiled;
        }

        let resolvedArgs = [];
        for (const argIndex in service.args) {
            const arg = service.args[argIndex];
            let resolvedArg;
            if (typeof arg === 'string') {
                if (arg.indexOf('@') === 0) {
                    const processedArgName = arg.substring(1);

                    if (!this.parameters.hasOwnProperty(processedArgName)) {
                        throw new Error("Parameter '" + processedArgName + "' not found");
                    }

                    resolvedArg = this.getParameter(processedArgName);
                } else if (arg.indexOf(':') === 0) {
                    const processedArgName = arg.substring(1);
                    resolvedArg = this.resolve(processedArgName);
                } else {
                    resolvedArg = arg;
                }
            } else {
                resolvedArg = arg;
            }
            resolvedArgs.push(resolvedArg);
        }

        const result = new service.className(...resolvedArgs);
        if (service.shared) {
            service.compiled = result;
        }
        return result;
    }
}
