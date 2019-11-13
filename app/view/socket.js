import io from "socket.io-client";

export default {
    init(gameState) {
        this.socket = io();
        this.subscribe();
        this.gameState = gameState;

        const userNameMatches = window.location.href.match(
            /^(.*)\?username=(.*)$/
        );
        let username = userNameMatches && userNameMatches[2];
        if (username) {
            this.socket.emit("verify", username);
        }
    },
    sendInput(inputType, arg) {
        switch (inputType) {
            case "up":
                this.socket.emit("player-input", {
                    direction: inputType,
                    move: arg
                });
                break;
            case "down":
                this.socket.emit("player-input", {
                    direction: inputType,
                    move: arg
                });
                break;
            case "left":
                this.socket.emit("player-input", {
                    direction: inputType,
                    move: arg
                });
                break;
            case "right":
                this.socket.emit("player-input", {
                    direction: inputType,
                    move: arg
                });
                break;
            case "bomb":
                this.socket.emit("player-action", {
                    type: "bomb"
                });
                break;
        }
    },
    loginAsGuest() {
        this.socket.emit("login-as-guest");
    },
    joinQueue() {
        if (this.gameState.connected) {
            this.socket.emit("join-queue");
        }
    },
    subscribe() {
        this.socket.on("player-add", ({ id, x, y, speed }) => {
            if (!this.gameState.inGame) return;

            this.gameState.addPlayer(id);
            console.log("event player-add ", id, x, y);
            if (typeof x !== "undefined" && typeof y !== "undefined") {
                this.gameState.players[id].setPos(x, y);
            }
            if (typeof speed !== "undefined") {
                this.gameState.players[id].speed = speed;
            }
        });
        this.socket.on(
            "player-update",
            ({ id, x, y, speed, visible, moving, direction }) => {
                if (!this.gameState.inGame) return;

                if (typeof x !== "undefined" && typeof y !== "undefined") {
                    this.gameState.players[id].setPos(x, y);
                }
                if (typeof speed !== "undefined") {
                    this.gameState.players[id].speed = speed;
                }
                if (typeof moving !== "undefined") {
                    this.gameState.players[id].moving = moving;
                }
                if (typeof direction !== "undefined") {
                    this.gameState.players[id].direction = direction;
                }
                if (typeof visible !== "undefined") {
                    this.gameState.players[id].visible = visible;
                }
            }
        );
        this.socket.on("player-remove", ({ id }) => {
            if (!this.gameState.inGame) return;

            let player = this.gameState.players[id];
            player.destroy();
            delete this.gameState.players[id];
        });
        this.socket.on("entity-add", ({ id, texture, x, y }) => {
            if (!this.gameState.inGame) return;

            this.gameState.addEntity(id, texture, x, y);
        });
        this.socket.on("entity-update", ({ id, x, y }) => {
            if (!this.gameState.inGame) return;

            this.gameState.updateEntity(id, x, y);
        });
        this.socket.on("entity-remove", ({ id }) => {
            if (!this.gameState.inGame) return;

            this.gameState.removeEntity(id);
        });
        this.socket.on("effect", param => {
            if (!this.gameState.inGame) return;

            if (param.type === "explosion") {
                console.log("creating explosion");
                this.gameState.createExplosion(param.x, param.y, param.radius);
            }
        });
        this.socket.on("join-game", () => {
            if (!this.gameState.inGame) {
                console.log("Starting game");
                this.gameState.inGame = true;
                this.gameState.setScreen("ingame");
            }
        });
        this.socket.on("end-game", ({ scores }) => {
            this.gameState.scores = scores;
            this.gameState.inGame = false;
            this.gameState.resetStage();
            console.log("Leaving game");

            this.gameState.setScreen("endGame");
        });
        this.socket.on("map-set", map => {
            if (!this.gameState.inGame) return;
            this.gameState.setMap(map);
        });

        this.socket.on("tile-set", ({ x, y, tile }) => {
            if (!this.gameState.inGame) return;
            console.log("Updating tile at x=%i y=%i", x, y);
            this.gameState.updateTile(x, y, tile);
        });

        this.socket.on("connectedAs", ({ username }) => {
            console.log("connected", username);
            this.gameState.connected = true;
            this.gameState.connectedAs = username;
            this.gameState.setScreen("mainMenu");

            history.pushState({}, "bomberps", "/");
        });
        this.socket.on("game-info", info => {
            this.gameState.gameInfo = info;
        });
    }
};
