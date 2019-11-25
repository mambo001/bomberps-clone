const Party = require("../model/Party");
const Controller = require("./Controller");

const MAX_PARTY_NUMBER = 1;
let nextId = 0;
class PartyController extends Controller {
    constructor(engine) {
        super("party", engine);
        this._partyList = [];
    }

    createNewParty() {
        if (this.partyCount >= MAX_PARTY_NUMBER) {
            console.log(
                "Reached party count limit (%i/%i)",
                this.partyCount,
                MAX_PARTY_NUMBER
            );
            return null;
        }
        let party = new Party(nextId++, this);
        this._partyList.push(party);
        return party;
    }

    endParty(party) {
        for (const player of party.level.players) {
            player.socket.userinfo.isInParty = false;
        }
        this.removeParty(party);
    }

    removeParty(party) {
        for (let i = 0; i < this.partyCount; i++) {
            if (this._partyList[i].id === party.id) {
                party.dispose();
                this._partyList.splice(i, 1);
            }
        }
    }

    getPartyFromId(id) {
        return this._partyList.find(party => {
            return party.id === id;
        });
    }

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
        let party = this.getPartyFromId(partyId);
        let player = party.addPlayer(socket);
        socket.userinfo.isInParty = true;
        socket.partyId = partyId;
        socket._playerInstance = player;

        socket.emit("map-set", party.level.tiles);
    }

    get partyCount() {
        return this._partyList.length;
    }
}

module.exports = PartyController;
