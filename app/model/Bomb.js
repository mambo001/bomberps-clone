const Entity = require("./Entity");

const DEFAULT_BOMB_EXPLOSION_TIME = 4;

class Bomb extends Entity {
    constructor(player, id, x, y) {
        super();
        this.player = player;
        this._id = id;
        this.x = x;
        this.y = y;

        this.mustExplode = false;
        this.explosionCooldown = DEFAULT_BOMB_EXPLOSION_TIME;
        this._timer = 0;
    }

    update(delta) {
        this._timer += delta;
        if (this._timer >= this.explosionCooldown) {
            this.mustExplode = true;
        }
    }

    get id() {
        return this._id;
    }
}

module.exports = Bomb;
