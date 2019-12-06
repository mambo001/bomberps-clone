import * as PIXI from "pixi.js";
import Screen from "./Screen";
import Button from "../button";

let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    align: "center",
    fill: 0xffffff
});
export default class EndGameScreen extends Screen {
    constructor(gameState, socketManager) {
        super();

        this.quitButton = new Button("Retour menu", 100, 50, 200, 75);
        this.quitButton.onClick = () => {
            gameState.setScreen("mainMenu");
        };
        this.addChild(this.quitButton);

        this.scoreList = [];
        for (let i = 1; i <= 4; i++) {
            let obj = {};

            obj.nameTag = new PIXI.Text("" + i + ".", style);
            obj.nameTag.anchor.set(0.5);
            obj.nameTag.x = gameState.app.view.width / 2 - 100;
            obj.nameTag.y = gameState.app.view.height / 2 - 100 + 75 * i;

            obj.scoreTag = new PIXI.Text("", style);
            obj.scoreTag.anchor.set(0.5);
            obj.scoreTag.x = gameState.app.view.width / 2 + 150;
            obj.scoreTag.y = gameState.app.view.height / 2 - 100 + 75 * i;

            this.scoreList.push(obj);
            this.addChild(obj.nameTag);
            this.addChild(obj.scoreTag);
        }

        this.title = new PIXI.Text("Score", style);
        this.title.anchor.set(0.5);
        this.title.x = gameState.app.view.width / 2;
        this.title.y = gameState.app.view.height / 2 - 200;

        this.addChild(this.title);
    }

    show(gameState, socketManager) {
        console.log("Showing score !", gameState.score);
        for (let i = 1; i <= gameState.scores.length; i++) {
            this.scoreList[i - 1].nameTag.text =
                "" + i + ". " + gameState.scores[i - 1].id;
            this.scoreList[i - 1].scoreTag.text = gameState.scores[
                i - 1
            ].score.toString();
        }
    }

    hide(gameState, socketManager) {}
}
