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
        this.socket.on("player-add", ({ id, pos }) => {
            this.gameState.addPlayer(id);
            console.log("event player-add ", id, pos);
            if (typeof pos !== "undefined") {
                this.gameState.players[id].x = pos.x;
                this.gameState.players[id].y = pos.y;
            }
        });
        this.socket.on("player-update", arg => {
            this.gameState.players[arg.id].x = arg.pos.x;
            this.gameState.players[arg.id].y = arg.pos.y;
            this.gameState.players[arg.id].visible = arg.visible;
        });
        this.socket.on("player-remove", ({ id }) => {
            let player = this.gameState.players[id];
            player.destroy();
            delete this.gameState.players[id];
        });
        this.socket.on("entity-add", ({ id, texture, x, y }) => {
            this.gameState.addEntity(id, texture, x, y);
        });
        this.socket.on("entity-update", ({ id, x, y }) => {
            this.gameState.updateEntity(id, x, y);
        });
        this.socket.on("entity-remove", ({ id }) => {
            this.gameState.removeEntity(id);
        });
        this.socket.on("effect", param => {
            if (param.type === "explosion") {
                console.log("creating explosion");
                this.gameState.createExplosion(param.x, param.y, param.radius);
            }
        });
        this.socket.on("join-game", () => {
            if (!this.gameState.inGame) {
                this.gameState.inGame = true;
                this.gameState.app.stage.removeChild(
                    this.gameState.uiContainer
                );
                this.gameState.app.stage.addChild(this.gameState.mainContainer);
            }
        });
        this.socket.on("leave-game", () => {
            if (this.gameState.inGame) {
                this.gameState.inGame = false;
                this.gameState.app.stage.removeChild(
                    this.gameState.mainContainer
                );
                this.gameState.app.stage.addChild(this.gameState.uiContainer);

                this.gameState.resetStage();
            }
        });
        this.socket.on("map-set", map => {
            if (!this.gameState.inGame) return;
            this.gameState.setMap(map);
        });

        this.socket.on("connectedAs", ({ username }) => {
            console.log("connected", username);
            this.gameState.uiContainer.removeChild(
                this.gameState.loginButtonGroup
            );
            this.gameState.queueJoinBtn.addToContainer(
                this.gameState.uiContainer
            );
            this.gameState.connected = true;
            this.gameState.connectedAs = username;
            this.gameState.addHUDText();
            history.pushState({}, "bomberps", "/");
        });
    }
};
