import * as PIXI from "pixi.js";
import keyboard from "./keyboard";
import socketManager from "./socket";
import GameState from "./gamestate";
import GameScreen from "./screens/GameScreen";
import LoginScreen from "./screens/LoginScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
import gameInfoHUD from "./screens/GameInfoHUD";
import GameInfoHUD from "./screens/GameInfoHUD";

const app = new PIXI.Application({
    antialias: true,
    width: MAP_PIXEL_WIDTH,
    height: MAP_PIXEL_HEIGHT
});

const gameState = new GameState(app);

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
    var up = keyboard("z"),
        down = keyboard("s"),
        left = keyboard("q"),
        right = keyboard("d"),
        bomb = keyboard(" "),
        debugReset = keyboard("r");

    debugReset.press = () => {
        socketManager.socket.emit("debug-reset");
    };

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

    gameState.app = app;
    gameState.socketManager = socketManager;

    app.stage.addChild(gameState.screenContainer);

    // Register all screens
    gameState.screens.gameInfoHUD = new GameInfoHUD(gameState, socketManager);
    gameState.screens.login = new LoginScreen(gameState, socketManager);
    gameState.screens.mainMenu = new MainMenuScreen(gameState, socketManager);
    gameState.screens.ingame = new GameScreen(gameState, socketManager);

    gameState.setScreen("login");
}
