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
                this.socket.emit("player-input", {
                    direction: inputType,
                    move: arg
                });
                break;
        }
    },
    subscribe() {
        this.socket.on("player-add", ({ id, pos }) => {
            this.gameState.addPlayer(id);
            console.log("event player-add ", id, pos);
            if (typeof pos !== "undefined") {
                this.gameState.players[id].sprite.x = pos.x * 32;
                this.gameState.players[id].sprite.y = pos.y * 32;
            }
        });
        this.socket.on("player-update", arg => {
            this.gameState.players[arg.id].sprite.x = arg.pos.x * 32;
            this.gameState.players[arg.id].sprite.y = arg.pos.y * 32;
        });
        this.socket.on("player-remove", ({ id }) => {
            let player = this.gameState.players[id];
            this.gameState.mainContainer.removeChild(player.sprite);
            delete this.gameState.players[id];
        });
    }
};
