import Player from "./player";
import * as PIXI from "pixi.js";

let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    align: "center",
    fill: 0xff0000
});

export default class GameState {
    constructor(app) {
        this.inGame = false;
        this.app = null;
        this.mainContainer = null;
        this.playerContainer = null;
        this.tileContaine = null;
        this.bonusContaine = null;
        this.effectContaine = null;
        this.uiContaine = null;
        this.hudContaine = null;
        this.connected = false;
        this.map = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.wallSprites = [];
        this.players = {};
        this.entities = [];
        this.effects = [];
        this.gameInfo = {
            queueSize: -1
        };

        app.ticker.add(delta => {
            this.update(delta);
        });
    }

    update(delta) {
        let player;

        for (const playerId in this.players) {
            player = this.players[playerId];

            if (player.moving) {
                if (player.direction === "up") {
                    player.y -= player.speed * delta;
                }
                if (player.direction === "down") {
                    player.y += player.speed * delta;
                }
                if (player.direction === "left") {
                    player.x -= player.speed * delta;
                }
                if (player.direction === "right") {
                    player.x += player.speed * delta;
                }
            }
        }
    }
    resetStage() {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] !== 0) {
                    this.map[y][x].destroy();
                }
            }
        }
        for (const player of this.players) {
            player.destroy();
        }
        for (const entity of this.entities) {
            entity.destroy();
        }
        this.map = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.entities = [];
        this.players = [];
    }
    addPlayer(id) {
        let player = new Player(id, "bomberman");
        this.playerContainer.addChild(player);
        this.players[id] = player;
        console.log("Added player ", player);
    }
    addEntity(id, texture, x, y) {
        let entity = PIXI.Sprite.from(texture);
        entity.eId = id;
        entity.x = x * TILE_SIZE;
        entity.y = y * TILE_SIZE;
        entity.width = 17 * (TILE_SIZE / 18);
        entity.height = TILE_SIZE;
        entity.anchor.set(0.5);
        this.bonusContainer.addChild(entity);
        this.entities.push(entity);
    }
    updateEntity(id, x, y) {
        let entity = this.bombs.find(x => {
            return x.eId === id;
        });
        entity.x = x * TILE_SIZE;
        entity.y = y * TILE_SIZE;
    }
    removeEntity(id) {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].eId === id) {
                this.entities[i].destroy();
                this.entities.splice(i, 1);
                return;
            }
        }
    }
    createExplosion(x, y, radius) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xff0000, 0.6);
        if (radius > 0) {
            graphics.drawRect(
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        for (let i = 1; i < radius; i++) {
            if (this.map[y][x - i] !== 0) break;
            graphics.drawRect(
                (x - i) * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        for (let i = 1; i < radius; i++) {
            if (this.map[y][x + i] !== 0) break;
            graphics.drawRect(
                (x + i) * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        for (let i = 1; i < radius; i++) {
            if (this.map[y - i][x] !== 0) break;
            graphics.drawRect(
                x * TILE_SIZE,
                (y - i) * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        for (let i = 1; i < radius; i++) {
            if (this.map[y + i][x] !== 0) break;
            graphics.drawRect(
                x * TILE_SIZE,
                (y + i) * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        graphics.endFill();
        graphics.zIndex = 25;

        this.effectContainer.addChild(graphics);
        setTimeout(() => {
            console.log("Destroying explosion");
            graphics.destroy();
        }, 3000);
    }
    setMap(map) {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] !== 0) {
                    this.map[y][x].destroy();
                }
            }
        }
        this.map = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        var sprite = null;

        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {
                if (this.map[y][x] !== 0) {
                    this.map[y][x].destroy();
                }
                if (map[y][x] === 1) {
                    sprite = PIXI.Sprite.from("wall");
                }
                if (map[y][x] === 2) {
                    sprite = PIXI.Sprite.from("obstacle");
                }

                if (sprite !== null) {
                    sprite.x = x * TILE_SIZE;
                    sprite.y = y * TILE_SIZE;
                    sprite.width = TILE_SIZE;
                    sprite.height = TILE_SIZE;
                    sprite.zIndex = 0;
                    sprite.type = map[y][x];

                    this.map[y][x] = sprite;
                    this.tileContainer.addChild(sprite);
                }
                sprite = null;
            }
        }
    }
    updateTile(x, y, tile) {
        if (this.map[y][x] !== 0) {
            if (this.map[y][x].type === tile) return;
            this.map[y][x].destroy();
        }
        let sprite = null;
        if (tile === 0) {
            this.map[y][x] = 0;
        }
        if (tile === 1) {
            sprite = PIXI.Sprite.from("wall");
        }

        if (sprite !== null) {
            sprite.x = x * TILE_SIZE;
            sprite.y = y * TILE_SIZE;
            sprite.width = TILE_SIZE;
            sprite.height = TILE_SIZE;
            sprite.zIndex = 0;
            sprite.type = tile;

            this.map[y][x] = sprite;
            this.tileContainer.addChild(sprite);
        }
    }
    addHUDText() {
        this.userText = new PIXI.Text("", style);
        this.userText.x = 15;
        this.userText.y = 15;
        this.hudContainer.addChild(this.userText);

        this.queueSizeTxt = new PIXI.Text("", style);
        this.queueSizeTxt.x = 15;
        this.queueSizeTxt.y = 40;
        this.hudContainer.addChild(this.queueSizeTxt);
    }

    updateInfo() {
        if (this.connected) this.userText.text = "user: " + this.connectedAs;

        this.queueSizeTxt.text =
            "" + this.gameInfo.queueSize + " personne(s) dans la file";
    }
}
