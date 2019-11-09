const Entity = require("./Entity");

const DEFAULT_PLAYER_SPEED = 5;
const DEFAULT_PLAYER_SIZE = 1;

class Player extends Entity {
    constructor(socket) {
        super();
        this._socket = socket;
        this.visible = true;
        this.dead = false;
        this.speed = DEFAULT_PLAYER_SPEED;
        this.isDirty = false;
        this.displacementQueue = [];
        this.currentDisplacement = "none";
        this.targetTile = {
            x: -1,
            y: -1
        };
        this.moving = false;
        this.size = DEFAULT_PLAYER_SIZE;

        this.x = 3.5;
        this.y = 6.5;

        this.bombCooldown = 2.5;
        this.currentCooldown = 0;
    }

    update(delta) {
        if (this.currentCooldown > 0) {
            this.currentCooldown -= delta;
        }
        if (this.currentCooldown < 0) {
            this.currentCooldown = 0;
        }
    }

    get canBomb() {
        return this.currentCooldown === 0;
    }

    get id() {
        return this._socket.userinfo.name;
    }

    get socket() {
        return this._socket;
    }

    get targetDisplacement() {
        return this.displacementQueue.length != 0
            ? this.displacementQueue[this.displacementQueue.length - 1]
            : "none";
    }

    startBombCooldown() {
        this.currentCooldown = this.bombCooldown;
    }

    bomb(party) {
        if (this.canBomb) {
            console.log("No cooldown. Trying to pose bomb");
            party.poseBomb(this);
        }
    }

    subscribe(party) {
        this.socket.on("player-input", ({ direction, move }) => {
            if (move) {
                //console.log("Player %s started moving %s", this.id, direction);
                //console.log("Added %s to displacement queue", direction);
                this.displacementQueue.push(direction);
                this.moving = true;
            } else {
                this.displacementQueue.splice(
                    this.displacementQueue.indexOf(direction),
                    1
                );
                //console.log("Removed %s from displacement queue", direction);
                //console.log(this.position);
            }
        });
        this.socket.on("player-action", ({ type }) => {
            if (type === "bomb") {
                console.log("Received bomb request");
                this.bomb(party);
            }
        });
    }

    unsubscribe() {
        this.socket.removeAllListeners("player-input");
        this.socket.removeAllListeners("player-action");
    }
}

module.exports = Player;
