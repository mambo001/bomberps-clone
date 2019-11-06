const Party = require("../model/Party");
const Controller = require("./Controller");

class PartyController extends Controller {
    constructor(engine) {
        super("party", engine);
        this._partyList = [];
        this._partyCount = 0;
    }

    createParty() {}
}

module.exports = PartyController;
