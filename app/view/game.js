import * as PIXI from "pixi.js";
import keyboard from "./keyboard";
import socketManager from "./socket";
import gameState from "./gamestate";
import Button from "./button";

const app = new PIXI.Application({
    antialias: true,
    width: MAP_PIXEL_WIDTH,
    height: MAP_PIXEL_HEIGHT
});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader.add("bomb", "assets/bomb.png");
app.loader.add("bomberman", "assets/bomberman1.png");
app.loader.add("explosion", "assets/explosion.png");
app.loader.add("obstacle", "assets/obstacle.png");
app.loader.add("wall", "assets/wall.png");

app.loader.load((loader, resources) => {
    init();
});

function init() {
    const mainContainer = new PIXI.Container();

    var up = keyboard("z"),
        down = keyboard("s"),
        left = keyboard("q"),
        right = keyboard("d"),
        bomb = keyboard(" ");

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
    var canBomb = true;
    bomb.press = () => {
        if (canBomb) {
            socketManager.sendInput("bomb");
            canBomb = false;
        }
    };
    bomb.release = () => {
        canBomb = true;
    };

    socketManager.init(gameState);

    var uiContainer = new PIXI.Container();
    let playAsGuest = new Button(
        "Jouer en tant qu'invité",
        app.view.width / 2,
        app.view.height / 2,
        340,
        75
    );
    playAsGuest.addToContainer(uiContainer);

    app.stage.addChild(uiContainer);
    console.log(playAsGuest);

    gameState.app = app;
    gameState.uiContainer = uiContainer;
    gameState.mainContainer = mainContainer;
}
