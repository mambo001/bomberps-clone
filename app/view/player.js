import * as PIXI from "pixi.js";

const scale = TILE_SIZE / 25;

const style = new PIXI.TextStyle({
    fill: ["#ffffff"], // gradient
    wordWrap: true
});

export default class Player extends PIXI.Container {
    constructor(id, texture) {
        super();
        this._id = id;
        this._sprite = PIXI.Sprite.from(texture);
        this._sprite.width = 16 * scale;
        this._sprite.height = 25 * scale;
        this._sprite.anchor.set(0.5);
        this._sprite.zIndex = 50;

        this._nameText = new PIXI.Text(id, style);
        this._nameText.anchor.set(0.5);
        this._nameText.y -= 35;
        this._nameText.zIndex = 100;

        this._visible = true;

        this.speed = 3;
        this.direction = "none";
        this.moving = false;

        this.addChild(this._sprite);
        this.addChild(this._nameText);
    }

    get id() {
        return this._id;
    }

    setPos(x, y) {
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setMoving(moving) {
        this.moving = moving;
    }

    setDirection(dir) {
        this.direction = dir;
    }
}
