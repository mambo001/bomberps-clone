const Controller = require("./Controller");

class QueueController extends Controller {
    constructor(engine) {
        super("queue", engine);
        this._queue = [];
        this.partyController = this.engine.partyController;
        this._handle = setInterval(() => this.updateQueue(), 5000);
    }

    updateQueue() {
        console.log("Updating queue...");
        if (
            this._queue.length >= 2 ||
            (process.env.NODE_ENV === "development" && this._queue.length >= 1)
        ) {
            let party = this.partyController.createNewParty();
            if (party == null) {
                return;
            }
            console.log("Launching party");

            let playerPool = this.pickPlayerPool(4);
            console.log("Creating party with %i players", playerPool.length);
            for (const player of playerPool) {
                console.log(player.userinfo.name);
                player.emit("join-game");
            }

            for (const player of playerPool) {
                player.inQueue = false;
                this._queue.splice(
                    this._queue.findIndex(x => {
                        return x.id === player.id;
                    })
                );
                this.partyController.putPlayerInParty(player, party.id);
            }
            console.log("New queue size : ", this.queueSize);
            this.engine.io.emit("game-info", {
                queueSize: this.queueSize
            });
        }
    }

    joinQueue(socket) {
        //this.engine.partyController.putPlayerInParty(socket, 0);
        if (socket.inQueue || socket.isInParty) return;
        this._queue.push(socket);
        socket.inQueue = true;
        console.log("New queue size : ", this.queueSize);

        this.engine.io.emit("game-info", {
            queueSize: this.queueSize
        });
    }

    pickPlayerPool(size) {
        let players = [];
        let availableIndexes = [];
        for (let i = 0; i < this._queue.length; i++) {
            availableIndexes.push(i);
        }
        while (players.length < size && availableIndexes.length != 0) {
            let randomInt = this.randomInt(0, availableIndexes.length - 1);
            players.push(this._queue[availableIndexes[randomInt]]);
            availableIndexes.splice(randomInt, 1);
        }
        return players;
    }

    get queueSize() {
        return this._queue.length;
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max + 1)) + min;
    }
}

module.exports = QueueController;
