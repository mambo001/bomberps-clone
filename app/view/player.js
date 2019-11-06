import * as PIXI from "pixi.js";

const scale = TILE_SIZE / 25;

const style = new PIXI.TextStyle({
    fill: ["#ffffff"], // gradient
    wordWrap: true
});

export default class Player {
    constructor(id, texture) {
        this._id = id;
        this.sprite = PIXI.Sprite.from(texture);
        this.sprite.width = 16 * scale;
        this.sprite.height = 25 * scale;
        this.sprite.anchor.set(0.5);
        this.debugText = new PIXI.Text("x = \ny = ", style);
        this._x = 0;
        this._y = 0;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(newX) {
        this._x = newX;
        this.debugText.text = "x = " + newX + "\ny = " + this.y;
        this.sprite.x = newX * TILE_SIZE;
        this.debugText.x = newX * TILE_SIZE;
    }

    set y(newY) {
        this._y = newY;
        this.sprite.y = newY * TILE_SIZE;
        this.debugText.y = newY * TILE_SIZE;
        this.debugText.text = "x = " + this.x + "\ny = " + newY;
    }

    get id() {
        return this._id;
    }
}
