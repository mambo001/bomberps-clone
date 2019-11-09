const Player = require("./Player");
const process = require("process");
const Level = require("./Level");

const MAX_PARTY_SIZE = 4;

const hrtimeMs = function() {
    let time = process.hrtime();
    return time[0] * 1000 + time[1] / 1000000;
};
class Party {
    constructor(id) {
        this._id = id;
        this.lastUpdateTime = hrtimeMs;
        this._handle = setInterval(() => this.loop(), 1000 / 60);

        this.level = new Level();
    }

    get id() {
        return this._id;
    }

    get size() {
        return this.level.players.length;
    }

    update(delta) {
        let bomb;
        for (let i = 0; i < this.level.bombs.length; i++) {
            bomb = this.level.bombs[i];
            bomb.update(delta);
            if (bomb.mustExplode) {
                this.createExplosion(bomb.tileX, bomb.tileY, 3);
                this.removeBomb(bomb);
            }
        }
        bomb = undefined;

        for (const player of this.level.players) {
            player.update(delta);
            this.level.updatePlayer(delta, player);
            if (player.isDirty) {
                this.broadcast("player-update", {
                    id: player.id,
                    pos: player.position,
                    visible: player.visible
                });
            }
        }
    }

    loop() {
        var currentTime = hrtimeMs();
        var delta = (currentTime - this.lastUpdateTime) / 1000;

        this.update(delta);

        this.lastUpdateTime = currentTime;
    }

    createExplosion(x, y, radius) {
        // Explode tiles at right
        for (let i = 0; i < radius; i++) {
            if (x + i > 15) break;
            if (this.level.isTileBlocked(x + i, y)) {
                break;
            }
            this.level.explodeTile(x + i, y);
        }
        // Explode tiles at left
        for (let i = 0; i < radius; i++) {
            if (x - i < 0) break;
            if (this.level.isTileBlocked(x - i, y)) {
                break;
            }
            this.level.explodeTile(x - i, y);
        }
        // Explode up tiles
        for (let i = 0; i < radius; i++) {
            if (y - i < 0) break;
            if (this.level.isTileBlocked(x, y - i)) {
                break;
            }
            this.level.explodeTile(x, y - i);
        }
        // Explode down tiles
        for (let i = 0; i < radius; i++) {
            if (y + i > 13) break;
            if (this.level.isTileBlocked(x, y + i)) {
                break;
            }
            this.level.explodeTile(x, y + i);
        }
        this.broadcast("effect", {
            type: "explosion",
            x: x,
            y: y,
            radius: radius
        });
    }

    broadcast(eventName, arg) {
        for (var i = 0; i < this.level.players.length; i++) {
            this.level.players[i].socket.emit(eventName, arg);
        }
    }

    addPlayer(socket) {
        if (this.size >= MAX_PARTY_SIZE) {
            console.log("This party is full");
            return;
        }
        let player = new Player(socket);
        player.subscribe(this);

        for (const p of this.level.players) {
            player.socket.emit("player-add", {
                id: p.id,
                pos: p.position
            });
        }
        for (const bomb of this.level.bombs) {
            player.socket.emit("entity-add", {
                id: bomb.id,
                texture: "bomb",
                x: bomb.x,
                y: bomb.y
            });
        }
        this.level.players.push(player);
        return player;
    }

    poseBomb(player) {
        let bomb = this.level.addBomb(player);
        if (bomb !== null) {
            this.broadcast("entity-add", {
                id: bomb.id,
                texture: "bomb",
                x: bomb.x,
                y: bomb.y
            });
            console.log("Bomb (%i) added !", bomb.id);
        }
    }

    removeBomb(bomb) {
        this.level.removeBomb(bomb);
        console.log("bombs len = ", this.level.bombs.length);

        this.broadcast("entity-remove", { id: bomb.id });
    }

    removePlayer(socket) {
        let index = this.level.players.findIndex(x => x.socket.id == socket.id);
        if (index != -1) {
            console.log(
                "Player %s is leaving the party.",
                this.level.players[index].id
            );
            this.broadcast("player-remove", {
                id: this.level.players[index].id
            });
            this.level.players[index].unsubscribe();
            this.level.players.splice(index, 1);
        }
    }

    dispose() {
        clearInterval(this._handle);
    }
}

module.exports = Party;
