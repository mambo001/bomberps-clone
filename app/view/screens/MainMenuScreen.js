import Screen from "./Screen";
import gameInfoHUD from "./GameInfoHUD";
import Button from "../button";
import GameInfoHUD from "./GameInfoHUD";

export default class MainMenuScreen extends Screen {
    constructor(gameState, socketManager) {
        super();
        let queueJoinBtn = new Button(
            "Find a game",
            gameState.app.view.width / 2,
            gameState.app.view.height / 2,
            450,
            75
        );
        queueJoinBtn.onClick = () => {
            socketManager.joinQueue();
        };
        this.addChild(queueJoinBtn);

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
