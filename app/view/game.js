import * as PIXI from "pixi.js";
import keyboard from "./keyboard";
import socketManager from "./socket";
import GameState from "./gamestate";
import GameScreen from "./screens/GameScreen";
import LoginScreen from "./screens/LoginScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
import GameInfoHUD from "./screens/GameInfoHUD";
import EndGameScreen from "./screens/EndGameScreen";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    antialias: true,
    width: MAP_PIXEL_WIDTH,
    height: MAP_PIXEL_HEIGHT
});

const gameState = new GameState(app);

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);
app.view.style.position = "absolute";
app.view.style.left = "50%";
app.view.style.top = "50%";
app.view.style.transform = "translate3d( -50%, -50%, 0 )";

// load the texture we need
app.loader.add("assets/spritesheet.json");

app.loader.load((loader, resources) => {
    init();
});

function init() {
    var up = keyboard("ArrowUp"),
        down = keyboard("ArrowDown"),
        left = keyboard("ArrowLeft"),
        right = keyboard("ArrowRight"),
        z = keyboard("z"),
        s = keyboard("s"),
        q = keyboard("q"),
        d = keyboard("d"),
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
    z.press = () => {
        socketManager.sendInput("up", true);
    };
    z.release = () => {
        socketManager.sendInput("up", false);
    };
    s.press = () => {
        socketManager.sendInput("down", true);
    };
    s.release = () => {
        socketManager.sendInput("down", false);
    };
    q.press = () => {
        socketManager.sendInput("left", true);
    };
    q.release = () => {
        socketManager.sendInput("left", false);
    };
    d.press = () => {
        socketManager.sendInput("right", true);
    };
    d.release = () => {
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

    gameState.spritesheet =
        PIXI.Loader.shared.resources["assets/spritesheet.json"];

    app.stage.addChild(gameState.screenContainer);

    // Register all screens
    gameState.screens.gameInfoHUD = new GameInfoHUD(gameState, socketManager);
    gameState.screens.login = new LoginScreen(gameState, socketManager);
    gameState.screens.mainMenu = new MainMenuScreen(gameState, socketManager);
    gameState.screens.ingame = new GameScreen(gameState, socketManager);
    gameState.screens.endGame = new EndGameScreen(gameState, socketManager);

    gameState.setScreen("login");
}
