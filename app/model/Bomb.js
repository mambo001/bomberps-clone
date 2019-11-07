const Entity = require("./Entity");

class Bomb extends Entity {
    constructor(player, id, x, y) {
        super();
        this.player = player;
        this._id = id;
        this.x = x;
        this.y = y;
    }

    get id() {
        return this._id;
    }
}

module.exports = Bomb;
