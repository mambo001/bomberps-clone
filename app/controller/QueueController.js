const Controller = require("./Controller");

class QueueController extends Controller {
    constructor(engine) {
        super("queue", engine);
        this._queue = [];
        this.partyController = this.engine.partyController;
    }

    updateQueue() {
        if (this._queue.length % 2 === 0) {
            console.log("Launching party");
            let party = this.partyController.createNewParty();
            let playerPool = this.pickPlayerPool(2);
            for (const player of playerPool) {
                player.inQueue = false;
                this._queue.splice(
                    this._queue.findIndex(x => {
                        return x.id === player.id;
                    })
                );
                this.partyController.putPlayerInParty(player, party.id);
            }
        }
        console.log("New queue size : ", this.queueSize);
        this.engine.io.emit("game-info", {
            queueSize: this.queueSize
        });
    }

    joinQueue(socket) {
        //this.engine.partyController.putPlayerInParty(socket, 0);
        if (socket.inQueue || socket.isInParty) return;
        this._queue.push(socket);
        socket.inQueue = true;
        this.updateQueue();
    }

    pickPlayerPool(size) {
        let players = [];
        let availableIndexes = [];
        for (let i = 0; i < this._queue.length; i++) {
            availableIndexes.push(i);
        }
        if (size === 2) {
            for (let i = 0; i < size; i++) {
                let randomInt = this.randomInt(0, availableIndexes.length - 1);
                players.push(this._queue[availableIndexes[randomInt]]);
                availableIndexes.splice(randomInt, 1);
            }
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
