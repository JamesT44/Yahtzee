export class Store {
    constructor() {
        this.contents = {}
    }

    add(key, value) {
        this.contents[key] = value
    }

    remove(key) {
        delete this.contents[key]
    }

    get(key) {
        return this.contents[key]
    }
}
