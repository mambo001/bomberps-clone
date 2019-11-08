import Player from "./player";
import * as PIXI from "pixi.js";

export default {
    inGame: false,
    app: null,
    mainContainer: null,
    uiContainer: null,
    hudContainer: null,
    connected: false,
    map: [
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
    ],
    wallSprites: [],
    players: {},
    entities: [],
    effects: [],
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
    },
    addPlayer(id) {
        let player = new Player(id, "bomberman");
        this.mainContainer.addChild(player.sprite);
        this.mainContainer.addChild(player.debugText);
        this.players[id] = player;
        console.log("Added player ", player);
    },
    addEntity(id, texture, x, y) {
        let entity = PIXI.Sprite.from(texture);
        entity.eId = id;
        entity.x = x * TILE_SIZE;
        entity.y = y * TILE_SIZE;
        entity.width = 17 * (TILE_SIZE / 18);
        entity.height = TILE_SIZE;
        entity.anchor.set(0.5);
        this.mainContainer.addChild(entity);
        this.entities.push(entity);
    },
    updateEntity(id, x, y) {
        let entity = this.bombs.find(x => {
            return x.eId === id;
        });
        entity.x = x * TILE_SIZE;
        entity.y = y * TILE_SIZE;
    },
    removeEntity(id) {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].eId === id) {
                this.mainContainer.removeChild(this.entities[i]);
                this.entities.splice(i, 1);
                return;
            }
        }
    },
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

        this.app.stage.addChild(graphics);
        setTimeout(() => {
            console.log("Destroying explosion");
            graphics.destroy();
        }, 3000);
    },
    setMap(map) {
        var sprite = null;

        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {
                if (this.map[y][x] !== 0) {
                    this.map[y][x].destroy();
                }
                if (map[y][x] === 1) {
                    sprite = PIXI.Sprite.from("wall");
                }

                if (sprite !== null) {
                    sprite.x = x * TILE_SIZE;
                    sprite.y = y * TILE_SIZE;
                    sprite.width = TILE_SIZE;
                    sprite.height = TILE_SIZE;
                    sprite.type = map[y][x];

                    this.map[y][x] = sprite;
                    this.mainContainer.addChild(sprite);
                }
                sprite = null;
            }
        }
    },
    updateTile(x, y, tile) {
        if (this.map[y][x] !== 0) {
            if (this.map[y][x].type === tile) return;
            this.map[y][x].destroy();
        }
        let sprite = null;
        if (map[y][x] === 1) {
            sprite = PIXI.Sprite.from("wall");
        }

        if (sprite !== null) {
            sprite.x = x * TILE_SIZE;
            sprite.y = y * TILE_SIZE;
            sprite.width = TILE_SIZE;
            sprite.height = TILE_SIZE;
            sprite.type = tile;

            this.map[y][x] = sprite;
            mainContainer.addChild(sprite);
        }
    },
    addHUDText() {
        if (this.connected) {
            let text = new PIXI.Text(this.connectedAs);
            text.x = 5;
            text.y = 5;
            this.hudContainer.addChild(text);
        }
    }
};
