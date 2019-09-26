export default class Service {
    name;
    className;
    shared = true;
    args = [];
    compiled = null;

    constructor(name, className, args = [], shared = true) {
        this.shared = shared;
        this.name = name;
        this.className = className;
        this.args = args;
    }
}
