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
        this._handle = setInterval(() => this.update(), 1000 / 60);

        this.level = new Level();
    }

    get id() {
        return this._id;
    }

    get size() {
        return this.level.players.length;
    }

    update() {
        var currentTime = hrtimeMs();
        var delta = (currentTime - this.lastUpdateTime) / 1000;

        this.level.update(delta);

        for (const player of this.level.players) {
            if (player.isDirty) {
                this.broadcast("player-update", {
                    id: player.id,
                    pos: player.position
                });
            }
        }

        this.lastUpdateTime = currentTime;
    }

    getTileAtPos(pos) {
        return this.map[Math.floor(pos.y)][Math.floor(pos.x)];
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
            console.log("Bomb added !");
        }
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
