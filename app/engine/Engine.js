const path = require("path");
const express = require("express");
const PartyController = require("../controller/PartyController");
const QueueController = require("../controller/QueueController");
const socketio = require("socket.io");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const http = require("http");

const UserInfo = require("../model/UserInfo");

const ClientUrl = process.env.CLIENT_URL || "http://localhost:8080";
const ApiUrl = process.env.API_URL || "http://localhost:8080";
const casService = encodeURI(ApiUrl + "/cas/callback/");
const casUrl = "https://cas.unistra.fr/cas";
const jwtSecret = process.env.JWT_SECRET || "JWT_TOKEN";

class Engine {
    constructor() {
        this.gameInfo = {
            connected: 0,
            queueSize: 0,
            partyNumber: 0,
            maxPartyNumber: 0
        };
    }

    start() {
        this.DIST_DIR = path.join(__dirname, "/../view/dist");
        this.HTML_FILE = path.join(this.DIST_DIR, "index.html");
        this.PORT = process.env.PORT || 8080;

        if (process.env.NODE_ENV === "development") {
            console.log("Starting bomberps (development)");
        } else {
            console.log("Starting bomberps");
        }
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketio(this.server);

        this.app.use(express.static(this.DIST_DIR));

        this.app.get("/", (req, res) => {
            res.sendFile(this.HTML_FILE);
        });

        this.app.get("/cas/redirect", (req, res) => {
            res.redirect(casUrl + "/login?service=" + casService);
        });

        this.app.get("/cas/callback", async (req, res) => {
            try {
                const casRes = await axios.get(casUrl + "/validate", {
                    params: {
                        ticket: req.query.ticket,
                        service: casService
                    }
                });

                if (!casRes.data.startsWith("yes")) {
                    console.log("failed login");
                    res.redirect(ClientUrl);
                    return;
                }
                let username = casRes.data.split("\n")[1];

                console.log("login", username);

                res.redirect(ClientUrl + "?username=" + username);
            } catch (e) {
                console.log(e);
                res.sendStatus(400);
            }
        });

        var id = 0;

        this.registerControllers();

        this.io.on("connection", socket => {
            console.log("A user connected");
            this.updateGameInfo(socket);

            socket.on("login-as-guest", () => {
                socket.userinfo = new UserInfo("player-" + id.toString());
                console.log("Guest ", socket.userinfo.name, " connected");
                this.gameInfo.connected++;
                this.updateAllGameInfo();

                id++;
                socket.verifyied = true;
                socket.emit("connectedAs", {
                    username: socket.userinfo.name
                });
            });

            socket.on("join-queue", () => {
                if (socket.verifyied) {
                    this.queueController.joinQueue(socket);
                }
            });

            socket.on("verify", async name => {
                if (!socket.verifyied) {
                    socket.userinfo = new UserInfo(name);
                    console.log("user is verified", socket.userinfo);
                    socket.verifyied = true;
                    socket.emit("connectedAs", {
                        username: socket.userinfo.name
                    });
                    this.gameInfo.connected++;
                    this.updateAllGameInfo();
                }
            });

            socket.on("debug-reset", () => {
                if (process.env.NODE_ENV === "development") {
                    let party = this.partyController.getPartyFromId(
                        socket.partyId
                    );
                    party._resetMap();
                }
            });

            socket.on("disconnect", () => {
                if (socket.userinfo) {
                    this.gameInfo.connected;
                    this.updateAllGameInfo();

                    console.log(
                        "Player ",
                        socket.userinfo.name,
                        " disconnected."
                    );
                    if (socket.userinfo.isInParty) {
                        this.partyController.playerLeave(socket);
                    }
                    if (socket.userinfo.inQueue) {
                        this.queueController.leaveQueue(socket);
                    }
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
        this.queueController = new QueueController(this);
    }

    updateAllGameInfo() {
        this.io.emit("game-info", this.gameInfo);
    }

    updateGameInfo(socket) {
        socket.emit("game-info", this.gameInfo);
    }
}

module.exports = Engine;
