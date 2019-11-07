import io from "socket.io-client";
import Player from "./player";

export default {
    init(gameState) {
        this.socket = io();
        this.subscribe();
        this.gameState = gameState;
        this.socket.emit("join-game");
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
        });
        this.socket.on("player-remove", ({ id }) => {
            let player = this.gameState.players[id];
            this.gameState.mainContainer.removeChild(player.sprite);
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
    }
};
