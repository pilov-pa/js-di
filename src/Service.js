export default class Service {
    name;
    tags = [];
    className;
    shared = true;
    args = [];
    compiled = null;

    constructor(name, className, args = [], shared = true, tags = []) {
        this.tags = tags;
        this.shared = shared;
        this.name = name;
        this.className = className;
        this.args = args;
    }
}
