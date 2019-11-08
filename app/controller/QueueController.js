const Controller = require("./Controller");

class QueueController extends Controller {
    constructor(engine) {
        super("queue", engine);
    }

    joinQueue(socket) {
        this.engine.partyController.putPlayerInParty(socket, 0);
    }
}

module.exports = QueueController;
