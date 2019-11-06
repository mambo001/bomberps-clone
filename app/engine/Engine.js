const path = require("path");
const express = require("express");
const PartyController = require("../controller/PartyController");
const socketio = require("socket.io");
const http = require("http");

const UserInfo = require("../model/UserInfo");

class Engine {
    constructor() {}

    start() {
        this.DIST_DIR = path.join(__dirname, "/../view/dist");
        this.HTML_FILE = path.join(this.DIST_DIR, "index.html");
        this.PORT = process.env.PORT || 8080;

        console.log("Starting bomberps");
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketio(this.server);

        this.app.use(express.static(this.DIST_DIR));

        this.app.get("*", (req, res) => {
            res.sendFile(this.HTML_FILE);
        });

        var id = 0;

        this.registerControllers();

        this.partyController.createNewParty();

        this.io.on("connection", socket => {
            console.log("A user connected");

            socket.on("join-game", () => {
                socket.userinfo = new UserInfo("player-" + id.toString());
                this.partyController.putPlayerInParty(socket, 0);
                console.log("User ", socket.userinfo.name, " joined game");
                id++;
            });

            socket.on("disconnect", () => {
                if (socket.userinfo) {
                    console.log(
                        "Player ",
                        socket.userinfo.name,
                        " disconnected."
                    );
                    this.partyController.playerLeave(socket);
                }
            });
        });

        this.server.listen(this.PORT, () => {
            console.log("App listening to %i....", this.PORT);
            console.log("Press Ctrl+C to quit.");
        });
    }

    registerControllers() {
        this.partyController = new PartyController(this);
    }
}

module.exports = Engine;
