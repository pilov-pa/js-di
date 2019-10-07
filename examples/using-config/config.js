import Greeting from "./classes/Greeting";
import GreetingFormatter from "./classes/GreetingFormatter";

export const services = [
    {
        name: 'greeting',
        class: Greeting,
        // pass to class constructor the scalar value 'Hello' as first argument
        // and the value of the parameter 'name' as second argument
        args: ['Hello', ':name'],
    },
    {
        name: 'greetingFormatter',
        class: GreetingFormatter,
        // pass to class constructor an instance of class Greeting, declared as a service 'greeting'
        args: ['@greeting'],
    },
];

export const parameters = {
    'name': 'World',
};
