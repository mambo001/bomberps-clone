import * as PIXI from "pixi.js";

const scale = TILE_SIZE / 24;

const style = new PIXI.TextStyle({
    fill: ["#ffffff"], // gradient
    wordWrap: true
});

const animationSpeed = 0.2;

export default class Player extends PIXI.Container {
    constructor(id, sheet) {
        super();
        this._id = id;

        var frames1 = [];

        for (let i = 0; i < 6; i++) {
            // magically works since the spritesheet was loaded with the pixi loader
            frames1.push(PIXI.Texture.from(`player/moving_side_${i + 1}.png`));
        }

        this.sideAnimation = new PIXI.AnimatedSprite(frames1);
        var frames2 = [];
        for (let i = 0; i < 6; i++) {
            // magically works since the spritesheet was loaded with the pixi loader
            frames2.push(PIXI.Texture.from(`player/moving_down_${i + 1}.png`));
        }
        this.downAnimation = new PIXI.AnimatedSprite(frames2);
        var frames3 = [];
        for (let i = 0; i < 6; i++) {
            // magically works since the spritesheet was loaded with the pixi loader
            frames3.push(PIXI.Texture.from(`player/moving_up_${i + 1}.png`));
        }
        this.upAnimation = new PIXI.AnimatedSprite(frames3);

        this.sideAnimation.width = 16 * scale;
        this.sideAnimation.height = 24 * scale;
        this.sideAnimation.animationSpeed = animationSpeed;
        //this.sideAnimation.anchor.set(0.5);

        this.downAnimation.width = 16 * scale;
        this.downAnimation.height = 24 * scale;
        this.downAnimation.animationSpeed = animationSpeed;

        //this.downAnimation.anchor.set(0.5);

        this.upAnimation.width = 16 * scale;
        this.upAnimation.height = 24 * scale;
        this.upAnimation.animationSpeed = animationSpeed;
        //this.upAnimation.anchor.set(0.5);

        this._nameText = new PIXI.Text(id, style);
        this._nameText.anchor.set(0.5);
        this._nameText.y -= 35;
        this._nameText.zIndex = 100;

        this._visible = true;

        this.speed = 3;
        this._direction = "none";
        this.moving = false;

        this.addChild(this.downAnimation);
        this.addChild(this.upAnimation);
        this.addChild(this.sideAnimation);
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

    stopAllAnimation() {
        this.sideAnimation.gotoAndStop(0);
        this.downAnimation.gotoAndStop(0);
        this.upAnimation.gotoAndStop(0);
    }

    get direction() {
        return this._direction;
    }

    set direction(dir) {
        this._direction = dir;
        this.stopAllAnimation();

        if (this.direction === "up") {
            this.upAnimation.visible = true;
            this.sideAnimation.visible = false;
            this.downAnimation.visible = false;
            this.upAnimation.gotoAndPlay(0);
        }
        if (this.direction === "down") {
            this.downAnimation.visible = true;
            this.sideAnimation.visible = false;
            this.upAnimation.visible = false;
            this.downAnimation.gotoAndPlay(0);
        }
        if (this.direction === "left" || this.direction === "right") {
            console.log(this.sideAnimation.scale.x);
            if (this.direction === "left") {
                this.sideAnimation.scale.x = -scale;
            } else {
                this.sideAnimation.scale.x = scale;
            }
            this.downAnimation.visible = false;
            this.upAnimation.visible = false;
            this.sideAnimation.visible = true;
            this.sideAnimation.gotoAndPlay(0);
        }
    }
}
