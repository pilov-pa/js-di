import Service from './Service';

export default class DI {
    services = {};

    parameters = {};

    add(name, className, args = [], shared = true, tags = []) {
        if (typeof name === 'object') {
            if (this.services.hasOwnProperty(name.name)) {
                throw new Error("Service '" + name.name + "' already exists");
            }
            this.services[name.name] = new Service(
                name.name,
                name.class,
                name.args,
                name.shared,
                name.tags,
            );
        } else {
            if (this.services.hasOwnProperty(name)) {
                throw new Error("Service '" + name + "' already exists");
            }

            if (!(typeof className === 'function')) {
                throw new Error("Parameter 'className' should be a class constructor");
            }

            this.services[name] = new Service(name, className, args, shared, tags);
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
                if (typeof arg === 'string' && arg.indexOf('@') === 0) {
                    const processedArgName = arg.substring(1);

                    if (!this.parameters.hasOwnProperty(processedArgName)) {
                        throw new Error("Parameter '" + processedArgName + "' not found");
                    }

                    resolvedArg = this.getParameter(processedArgName);
                } else if(typeof arg === 'string' && arg.indexOf(':') === 0) {
                    const processedArgName = arg.substring(1);
                    resolvedArg = this.resolve(processedArgName);
                } else {
                    resolvedArg = arg;
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
