import * as PIXI from "pixi.js";
import Screen from "./Screen";

export default class GameScreen extends Screen {
    constructor(gameState, socketManager) {
        super();
        this.gameState = gameState;

        this.sortChildren;

        this.playerContainer = new PIXI.Container();
        this.effectContainer = new PIXI.Container();
        this.bonusContainer = new PIXI.Container();
        this.tileContainer = new PIXI.Container();

        this.tileContainer.zIndex = 1;
        this.bonusContainer.zIndex = 2;
        this.effectContainer.zIndex = 3;
        this.playerContainer.zIndex = 4;

        this.addChild(this.tileContainer);
        this.addChild(this.bonusContainer);
        this.addChild(this.effectContainer);
        this.addChild(this.playerContainer);
    }

    show(gameState, socketManager) {}

    hide(gameState, socketManager) {}
}
