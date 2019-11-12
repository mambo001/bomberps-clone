import * as PIXI from "pixi.js";
import Screen from "./Screen";
import socket from "../socket";

let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    align: "center",
    fill: 0xff0000
});

export default class GameInfoHUD extends Screen {
    constructor(gameState, socketManager) {
        super();
        this.userText = new PIXI.Text("", style);
        this.userText.x = 15;
        this.userText.y = 15;
        this.addChild(this.userText);

        this.queueSizeTxt = new PIXI.Text("", style);
        this.queueSizeTxt.x = 15;
        this.queueSizeTxt.y = 40;
        this.addChild(this.queueSizeTxt);
        this.updateInfo = gameInfo => {
            this.queueSizeTxt.text =
                "" + gameInfo.queueSize + " personne(s) dans la file";
        };
    }

    show(gameState, socketManager) {
        socketManager.socket.on("game-info", this.updateInfo);
        if (gameState.connected)
            this.userText.text = "user: " + gameState.connectedAs;

        this.updateInfo(gameState.gameInfo);
    }

    hide(gameState, socketManager) {
        socketManager.socket.off("game-info", this.updateInfo);
    }
}
