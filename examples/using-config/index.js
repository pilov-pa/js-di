import DI from "simple-js-di";

import {services, parameters} from "./config";

let di = new DI();
di.addParameters(parameters);
di.addMulti(services);

const greetingFormatter = di.resolve("greetingFormatter");

console.log(greetingFormatter.getGreeting()); // Hello, World!