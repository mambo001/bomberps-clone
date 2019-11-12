import * as PIXI from "pixi.js";
import Screen from "./Screen";

export default class GameScreen extends Screen {
    constructor(gameState, socketManager) {
        super();
        this.gameState = gameState;

        this.playerContainer = new PIXI.Container();
        this.effectContainer = new PIXI.Container();
        this.bonusContainer = new PIXI.Container();
        this.tileContainer = new PIXI.Container();

        this.addChild(this.tileContainer);
        this.addChild(this.bonusContainer);
        this.addChild(this.effectContainer);
        this.addChild(this.playerContainer);
    }

    show(gameState, socketManager) {}

    hide(gameState, socketManager) {}
}
