import * as PIXI from "pixi.js";

let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    align: "center",
    fill: 0x000000
});

export default class Button {
    constructor(text, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.metrics = PIXI.TextMetrics.measureText(text, style);

        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();

        let renderer = PIXI.autoDetectRenderer();

        let texture = renderer.generateTexture(graphics);

        this.textWidth = this.metrics.width;
        this.textHeight = this.metrics.height;

        this.sprite = PIXI.Sprite.from("block.png");
        this.sprite.anchor.set(0.5);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.width = width;
        this.sprite.height = height;

        this.text = new PIXI.Text(text, style);
        this.text.anchor.set(0.5);
        this.text.x = x;
        this.text.y = y;

        this.onClick = () => {};

        this.sprite.on("pointerdown", () => {
            this.onClick();
        });
    }

    addToContainer(container) {
        container.addChild(this.sprite);
        container.addChild(this.text);
    }
}
