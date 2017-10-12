export class Project {
    constructor(customer, name) {
        this.key = `${customer}_${name}`;
        this.customer = customer;
        this.name = name;
    }

    key;
    customer;
    name;
    allocated;
    worked;
}