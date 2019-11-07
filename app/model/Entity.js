class Entity {
    constructor() {
        this._x = 0;
        this._y = 0;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(newX) {
        this._x = newX;
        this._tileX = Math.floor(newX);
    }

    set y(newY) {
        this._y = newY;
        this._tileY = Math.floor(newY);
    }

    get tileX() {
        return this._tileX;
    }

    get tileY() {
        return this._tileY;
    }
}

module.exports = Entity;
