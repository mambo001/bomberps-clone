const Player = require("./Player");
const process = require("process");

const MAX_PARTY_SIZE = 4;

const hrtimeMs = function() {
    let time = process.hrtime();
    return time[0] * 1000 + time[1] / 1000000;
};
class Party {
    constructor(id) {
        this._id = id;
        this._players = [];
        this.lastUpdateTime = hrtimeMs;
        this._handle = setInterval(() => this.update(), 1000 / 60);
    }

    get id() {
        return this._id;
    }

    get size() {
        return this._players.length;
    }

    update() {
        var currentTime = hrtimeMs();
        var delta = (currentTime - this.lastUpdateTime) / 1000;

        for (const player of this._players) {
            player.update(delta);
        }

        for (const player of this._players) {
            if (player.isDirty) {
                this.broadcast("player-update", {
                    id: player.id,
                    pos: player.position
                });
            }
        }

        this.lastUpdateTime = currentTime;
    }

    broadcast(eventName, arg) {
        for (var i = 0; i < this._players.length; i++) {
            this._players[i].socket.emit(eventName, arg);
        }
    }

    addPlayer(socket) {
        if (this.size >= MAX_PARTY_SIZE) {
            console.log("This party is full");
            return;
        }
        let player = new Player(socket);
        for (const p of this._players) {
            player.socket.emit("player-add", {
                id: p.id,
                pos: p.position
            });
        }
        this._players.push(player);
        return player;
    }

    removePlayer(socket) {
        let index = this._players.findIndex(x => x.socket.id == socket.id);
        if (index != -1) {
            console.log(
                "Player %s is leaving the party.",
                this._players[index].id
            );
            this.broadcast("player-remove", {
                id: this._players[index].id
            });
            this._players[index].unsubscribe();
            this._players.splice(index, 1);
        }
    }

    dispose() {
        clearInterval(this._handle);
    }
}

module.exports = Party;
