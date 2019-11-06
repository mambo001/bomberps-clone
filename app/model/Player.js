const DEFAULT_PLAYER_SPEED = 3;
const DEFAULT_PLAYER_SIZE = 1;

class Player {
    constructor(socket) {
        this._socket = socket;
        this._x = 0;
        this._y = 0;
        this._tiledPostion;
        this.speed = DEFAULT_PLAYER_SPEED;
        this.subscribe();
        this.isDirty = false;
        this.displacementQueue = [];
        this.currentDisplacement = "none";
        this.targetTile = {
            x: -1,
            y: -1
        };
        this.moving = false;
        this.size = DEFAULT_PLAYER_SIZE;

        this.x = 2.5;
        this.y = 6.5;
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

    get position() {
        return {
            x: this.x,
            y: this.y
        };
    }

    get tileX() {
        return this._tileX;
    }

    get tileY() {
        return this._tileY;
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

    subscribe() {
        this.socket.on("player-input", ({ direction, move }) => {
            if (move) {
                //console.log("Player %s started moving %s", this.id, direction);
                console.log("Added %s to displacement queue", direction);
                this.displacementQueue.push(direction);
                this.moving = true;
            } else {
                this.displacementQueue.splice(
                    this.displacementQueue.indexOf(direction),
                    1
                );
                console.log("Removed %s from displacement queue", direction);
                //console.log(this.position);
            }
        });
    }

    unsubscribe() {
        this.socket.removeAllListeners("player-input");
    }
}

module.exports = Player;
