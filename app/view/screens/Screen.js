import * as PIXI from "pixi.js";

export default class Screen extends PIXI.Container {
    constructor() {
        super();
    }

    show(gameState, socketManager) {
        throw new Error("show method must be implemented");
    }

    hide(gameState, socketManager) {
        throw new Error("hide method must be implemented");
    }
}
