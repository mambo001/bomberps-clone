import * as PIXI from "pixi.js";

let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    align: "center",
    fill: 0x000000
});

export default class Button extends PIXI.Container {
    constructor(text, x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.metrics = PIXI.TextMetrics.measureText(text, style);

        this.textWidth = this.metrics.width;
        this.textHeight = this.metrics.height;

        this.sprite = PIXI.Sprite.from("grass.png");
        this.sprite.anchor.set(0.5);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.width = width;
        this.sprite.height = height;

        this.text = new PIXI.Text(text, style);
        this.text.anchor.set(0.5);

        this.onClick = () => {};

        this.sprite.on("pointerdown", () => {
            this.onClick();
        });

        this.addChild(this.sprite);
        this.addChild(this.text);
    }
}
