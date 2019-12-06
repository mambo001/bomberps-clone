import Player from "./player";
import * as PIXI from "pixi.js";
import ingame from "./screens/GameScreen";

export default class GameState {
    constructor(app) {
        this.inGame = false;
        this.app = null;
        this.screenContainer = new PIXI.Container();
        this.currentScreen = null;
        this.screens = {};
        this.hudContainer = null;
        this.connected = false;
        this.spritesheet = null;
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

    setScreen(screen) {
        if (this.currentScreen !== null) {
            this.currentScreen.hide(this, this.socketManager);
            this.screenContainer.removeChild(this.currentScreen);
        }
        if (typeof this.screens[screen] === "undefined") {
            this.currentScreen = null;
            return;
        }
        this.currentScreen = this.screens[screen];
        this.currentScreen.show(this, this.socketManager);
        this.screenContainer.addChild(this.currentScreen);
    }
    resetStage() {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] !== 0) {
                    this.map[y][x].destroy();
                }
            }
        }
        for (let prop in this.players) {
            this.players[prop].destroy();
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
        this.players = {};
    }
    addPlayer(id) {
        let player = new Player(id, this.spritesheet);
        this.screens.ingame.playerContainer.addChild(player);
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
        this.screens.ingame.bonusContainer.addChild(entity);
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
            if (this.map[y][x - i].tileType !== 0) break;
            graphics.drawRect(
                (x - i) * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        for (let i = 1; i < radius; i++) {
            if (this.map[y][x + i].tileType !== 0) break;
            graphics.drawRect(
                (x + i) * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        for (let i = 1; i < radius; i++) {
            if (this.map[y - i][x].tileType !== 0) break;
            graphics.drawRect(
                x * TILE_SIZE,
                (y - i) * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        for (let i = 1; i < radius; i++) {
            if (this.map[y + i][x].tileType !== 0) break;
            graphics.drawRect(
                x * TILE_SIZE,
                (y + i) * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
        graphics.endFill();
        graphics.zIndex = 25;

        this.screens.ingame.effectContainer.addChild(graphics);
        setTimeout(() => {
            console.log("Destroying explosion");
            graphics.destroy();
        }, 250);
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
                if (map[y][x] === 0) {
                    sprite = PIXI.Sprite.from("grass.png");
                }
                if (map[y][x] === 1) {
                    sprite = PIXI.Sprite.from("wall.png");
                }
                if (map[y][x] === 2) {
                    sprite = PIXI.Sprite.from("block.png");
                }
                if (map[y][x] === 3) {
                    sprite = PIXI.Sprite.from("solid.png");
                }

                if (sprite !== null) {
                    sprite.tileType = map[y][x];
                    sprite.x = x * TILE_SIZE;
                    sprite.y = y * TILE_SIZE;
                    sprite.width = TILE_SIZE;
                    sprite.height = TILE_SIZE;
                    sprite.zIndex = 0;
                    sprite.type = map[y][x];
                    sprite.anchor.set(0);

                    this.map[y][x] = sprite;
                    this.screens.ingame.tileContainer.addChild(sprite);
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
            sprite = PIXI.Sprite.from("grass.png");
        }
        if (tile === 1) {
            sprite = PIXI.Sprite.from("wall.png");
        }

        if (sprite !== null) {
            sprite.x = x * TILE_SIZE;
            sprite.y = y * TILE_SIZE;
            sprite.tileType = tile;
            sprite.width = TILE_SIZE;
            sprite.height = TILE_SIZE;
            sprite.zIndex = 0;
            sprite.type = tile;
            sprite.anchor.set(0);

            this.map[y][x] = sprite;
            this.screens.ingame.tileContainer.addChild(sprite);
        }
    }
}
