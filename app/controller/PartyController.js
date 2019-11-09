const Party = require("../model/Party");
const Controller = require("./Controller");

const MAX_PARTY_NUMBER = 1;
let nextId = 0;
class PartyController extends Controller {
    constructor(engine) {
        super("party", engine);
        this._partyList = [];
        this._partyCount = 0;
    }

    createNewParty() {
        if (this._partyCount >= MAX_PARTY_NUMBER) {
            console.log("Reached party count limit");
            return;
        }
        this._partyList[0] = new Party(0);
    }

    getPartyFromId(id) {
        return this._partyList[id];
    }

    deleteParty() {}

    playerLeave(socket) {
        let party = this.getPartyFromId(socket.partyId);
        party.removePlayer(socket);
    }

    putPlayerInParty(socket, partyId) {
        if (socket.userinfo.isInParty) {
            console.log(
                "Player ",
                socket.userinfo.name,
                " is already in a party"
            );
            return;
        }
        let party = this._partyList[partyId];
        let player = party.addPlayer(socket);
        socket.userinfo.isInParty = true;
        socket.partyId = partyId;
        socket._playerInstance = player;

        socket.emit("join-game");
        socket.emit("map-set", party.level.tiles);

        party.broadcast("player-add", {
            id: player.id,
            x: player.x,
            y: player.y
        });
    }
}

module.exports = PartyController;
