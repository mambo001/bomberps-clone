import Player from "./player";
import * as PIXI from "pixi.js";

export default {
    inGame: true,
    app: null,
    mainContainer: null,
    map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    wallSprites: [],
    players: {},
    entities: [],
    effects: [],
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
    }
};
