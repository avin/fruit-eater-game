import _ from 'lodash';

export default class {

    constructor(app, options) {
        this.app = app;

        this._init();
    }

    _init() {

        //Bottom line
        var line = new PIXI.Graphics();
        line.lineStyle(2, 0xFFFFFF, 1);
        line.moveTo(0, this.app.options.height);
        line.lineTo(this.app.options.width, this.app.options.height);
        this.app.stage.addChild(line);

        //Score
        this.scoreText = new PIXI.Text(
            "Score: " + this.app.ship.state.score,
            {font: "14px sans-serif", fill: "white"}
        );
        this.scoreText.position = {
            x: 20,
            y: this.app.options.height + 10,
        };
        this.app.stage.addChild(this.scoreText);

        //Lives
        this.livesText = new PIXI.Text(
            "Lives: " + this.app.ship.state.lives,
            {font: "14px sans-serif", fill: "white"}
        );
        this.livesText.position = {
            x: 100,
            y: this.app.options.height + 10,
        };
        this.app.stage.addChild(this.livesText);

        console.log(this.livesText);
    }

    updateScore() {
        this.scoreText.text = "Score: " + this.app.ship.state.score;
    }

    updateLives() {
        this.livesText.text = "Lives: " + this.app.ship.state.lives;
    }
}