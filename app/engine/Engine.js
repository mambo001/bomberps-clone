const path = require("path");
const express = require("express");
const PartyController = require("../controller/PartyController");
const socketio = require("socket.io");
const http = require("http");

class Engine {
    constructor() {}

    start() {
        this.DIST_DIR = path.join(__dirname, "/../view/dist");
        this.HTML_FILE = path.join(this.DIST_DIR, "index.html");
        this.PORT = process.env.PORT || 8080;

        this.controllers = [];

        console.log("Starting bomberps");
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketio(this.server);

        this.app.use(express.static(this.DIST_DIR));

        this.app.get("*", (req, res) => {
            res.sendFile(this.HTML_FILE);
        });

        this.io.on("connection", socket => {
            console.log("A user connected");
        });

        this.server.listen(this.PORT, () => {
            console.log("App listening to %i....", this.PORT);
            console.log("Press Ctrl+C to quit.");
        });
    }

    registerControllers() {
        this.registerController(new PartyController());
    }

    registerController(controller) {
        this.controllers[controller.id] = controller;
        controller.init();
    }
}

module.exports = Engine;
