export default class GreetingFormatter
{
    greeting = null;

    constructor(greeting) {
        this.greeting = greeting;
    }

    getGreeting() {
        return this.greeting.greeting + ', ' + this.greeting.name + '!';
    }
}
