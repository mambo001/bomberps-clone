import * as PIXI from "pixi.js";

export default class Player {
    constructor(id, texture) {
        this._id = id;
        this.sprite = PIXI.Sprite.from(texture);
    }

    get id() {
        return this._id;
    }
}
