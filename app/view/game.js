import * as PIXI from "pixi.js";
import keyboard from "./keyboard";
import socketManager from "./socket";

const TILE_SIZE = 64;
const MAP_TILE_WIDTH = 15;
const MAP_PIXEL_WIDTH = MAP_TILE_WIDTH * TILE_SIZE;
const MAP_TILE_HEIGHT = 13;
const MAP_PIXEL_HEIGHT = TILE_SIZE * MAP_TILE_HEIGHT;

const app = new PIXI.Application({
    width: MAP_PIXEL_WIDTH,
    height: MAP_PIXEL_HEIGHT
});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

const state = {
    inGame: true,
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
    wallSprites: []
};

// load the texture we need
app.loader.add("bomb", "assets/bomb.png");
app.loader.add("bomberman", "assets/bomberman.png");
app.loader.add("explosion", "assets/explosion.png");
app.loader.add("obstacle", "assets/obstacle.png");
app.loader.add("wall", "assets/wall.png");

app.loader.load((loader, resources) => {
    init();
});

function init() {
    const mainContainer = new PIXI.Container();

    var sprite;
    for (var y = 0; y < MAP_TILE_HEIGHT; y++) {
        for (var x = 0; x < MAP_TILE_WIDTH; x++) {
            if (state.map[y][x] === 1) {
                sprite = PIXI.Sprite.from("wall");
                sprite.x = x * TILE_SIZE;
                sprite.y = y * TILE_SIZE;
                sprite.width = TILE_SIZE;
                sprite.height = TILE_SIZE;
                state.wallSprites.push(sprite);
                mainContainer.addChild(sprite);
                sprite = null;
            }
        }
    }
    var up = keyboard("z"),
        down = keyboard("s"),
        left = keyboard("q"),
        right = keyboard("d");

    up.press = () => {
        socketManager.sendInput("up", true);
    };
    up.release = () => {
        socketManager.sendInput("up", false);
    };
    down.press = () => {
        socketManager.sendInput("down", true);
    };
    down.release = () => {
        socketManager.sendInput("down", false);
    };
    left.press = () => {
        socketManager.sendInput("left", true);
    };
    left.release = () => {
        socketManager.sendInput("left", false);
    };
    right.press = () => {
        socketManager.sendInput("right", true);
    };
    right.release = () => {
        socketManager.sendInput("right", false);
    };

    app.stage.addChild(mainContainer);

    socketManager.init();
}
