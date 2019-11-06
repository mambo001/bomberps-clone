const PLAYER_SPEED = 2;

class Player {
    constructor(socket) {
        this._socket = socket;
        this.position = {
            x: 0,
            y: 0
        };
        this.subscribe();
        this.isDirty = false;
        this.moving = [];
    }

    get id() {
        return this._socket.userinfo.name;
    }

    get socket() {
        return this._socket;
    }

    update(delta) {
        if (this.moving.length == 0) {
            this.isDirty = false;
        } else {
            switch (this.moving[this.moving.length - 1]) {
                case "up":
                    this.position.y -= PLAYER_SPEED * delta;
                    break;
                case "down":
                    this.position.y += PLAYER_SPEED * delta;
                    break;
                case "left":
                    this.position.x -= PLAYER_SPEED * delta;
                    break;
                case "right":
                    this.position.x += PLAYER_SPEED * delta;
                    break;
            }
            this.isDirty = true;
        }
    }

    subscribe() {
        this.socket.on("player-input", ({ direction, move }) => {
            if (move) {
                console.log("Player %s started moving %s", this.id, direction);
                this.moving.push(direction);
            } else {
                this.moving.splice(this.moving.indexOf(direction), 1);
                console.log("Player %s stopped moving %s", this.id, direction);
                console.log(this.position);
            }
        });
    }

    unsubscribe() {
        this.socket.removeAllListeners("player-input");
    }
}

module.exports = Player;
