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
        this.sprite.zIndex = 50;

        this.nameText = new PIXI.Text(id, style);
        this.nameText.anchor.set(0.5);
        this.nameText.zIndex = 100;
        this._x = 0;
        this._y = 0;
        this._visible = true;
    }

    get visible() {
        return this._visible;
    }

    set visible(v) {
        this._visible = v;
        this.sprite.visible = v;
        this.nameText.visible = v;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(newX) {
        this._x = newX;
        this.sprite.x = newX * TILE_SIZE;
        this.nameText.x = newX * TILE_SIZE;
    }

    set y(newY) {
        this._y = newY;
        this.sprite.y = newY * TILE_SIZE;
        this.nameText.y = newY * TILE_SIZE - TILE_SIZE / 2;
    }

    get id() {
        return this._id;
    }

    destroy() {
        this.sprite.destroy();
        this.nameText.destroy();
    }
}
