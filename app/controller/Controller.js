class Controller {
    constructor(id, engine) {
        this._id = id;
        this._engine = engine;
    }

    get id() {
        return this._id;
    }

    get engine() {
        return this._engine;
    }
}

module.exports = Controller;
