import * as PIXI from "pixi.js";
import Screen from "./Screen";
import GameInfoHUD from "./GameInfoHUD";
import Button from "../button";

export default class LoginScreen extends Screen {
    constructor(gameState, socketManager) {
        super();
        let loginButtonGroup = new PIXI.Container();

        let playAsGuest = new Button(
            "Jouer en tant qu'invité",
            gameState.app.view.width / 2,
            gameState.app.view.height / 2,
            350,
            75
        );
        playAsGuest.onClick = () => {
            console.log("Clicked !");
            socketManager.loginAsGuest();
        };
        playAsGuest.addToContainer(loginButtonGroup);

        let login = new Button(
            "Se connecter (unistra)",
            gameState.app.view.width / 2,
            gameState.app.view.height / 2 - 100,
            350,
            75
        );
        login.onClick = () => {
            window.location.href = "/cas/redirect";
        };
        login.addToContainer(loginButtonGroup);

        this.addChild(loginButtonGroup);
        this.gameInfoHUD = new GameInfoHUD(gameState, socketManager);
        this.addChild(this.gameInfoHUD);
    }

    show(gameState, socketManager) {
        this.gameInfoHUD.show(gameState, socketManager);
    }

    hide(gameState, socketManager) {
        this.gameInfoHUD.hide(gameState, socketManager);
    }
}
