export default class PromisesBus {
    constructor() {
        this.promises = {}
        this.resolves = {}
        this.rejects = {}
    }

    when(what) {
        return this.register(what)
    }

    register(what) {
        if (Object.prototype.hasOwnProperty.call(this.promises, what)) {
            return this.promises[what]
        }

        this.promises[what] = new Promise((resolve, reject) => {
            this.resolves[what] = resolve
            this.rejects[what] = reject
        })

        return this.promises[what]
    }

    unregister(what) {
        this.register(what)

        delete this.promises[what]
        delete this.resolves[what]
        delete this.rejects[what]
    }

    resolve(what, ...args) {
        this.register(what)

        this.resolves[what].apply(
            this.promises[what],
            Array.prototype.slice.call(args, 1),
        )
    }

    reject(what, ...args) {
        this.register(what)

        this.rejects[what].apply(
            this.promises[what],
            Array.prototype.slice.call(args, 1),
        )
    }
}
