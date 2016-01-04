import _ from 'lodash';

export default class {

    constructor(app, options) {
        this.app = app;

        //Options
        this.options = {
            size: _.get(options, 'size', 5),
            color: _.get(options, 'color', 0xD7B000),
        };

        this.state = {
            move: {
                up: false,
                down: false,
                left: false,
                right: false,
            },
            score: 0,
            lives: 3,
            isCrash: false,
        };

        this._init();
    }


    _init() {
        let size = this.options.size;
        let color = this.options.color;

        this.figure = new PIXI.Graphics();
        this.figure.lineStyle(1, color);

        this.figure.moveTo((-2 * size), (-1 * size));
        this.figure.lineTo((2 * size), (0));
        this.figure.lineTo((-2 * size), (1 * size));
        this.figure.lineTo((-1 * size), (0));
        this.figure.lineTo((-2 * size), (-1 * size));

        this.figure.position = {
            x: this.app.options.width / 2,
            y: this.app.options.height / 2,
        };

        this.figure.endFill();

        this.app.stage.addChild(this.figure);

        this.maxSpeed = 5;
        this.minSpeed = 0;
        this.speed = this.minSpeed;
    }

    /**
     * Повышаем скорость
     */
    speedUp() {
        if (this.speed < this.maxSpeed) {
            this.speed += 0.1
        }
    }

    /**
     * Понижаем скорость
     */
    speedDown() {
        if (this.speed > this.minSpeed) {
            this.speed -= 0.1
        }
    }

    moveLeft() {
        this.figure.rotation -= 0.1;
    }

    moveRight() {
        this.figure.rotation += 0.1;
    }

    eatFruit(fruit) {
        this.state.score += Math.round(1 * this.speed);
        fruit.destroy();
        this.app.scoreboard.updateScore();
    }

    bombCrash(bomb) {
        bomb.destroy();
        this.crash();
    }

    crash(){

        this.state.isCrash = true;
        this.state.lives -= 1;
        if (this.state.lives === 0){
            this.app.gameOver();
            return;
        }
        this.app.scoreboard.updateLives();
    }

    update() {

        //Обрабаотываем нажатия клавиш
        if (this.state.move.up) {
            this.speedUp();
        }
        if (this.state.move.down) {
            this.speedDown();
        }
        if (this.state.move.left) {
            this.moveLeft();
        }
        if (this.state.move.right) {
            this.moveRight();
        }

        //Двигаем корабль
        this.figure.position.x += Math.cos(this.figure.rotation) * this.speed;
        this.figure.position.y += Math.sin(this.figure.rotation) * this.speed;

        //Если живы
        if (!this.state.isCrash) {

            //Натыкаемся на фрукты
            _.each(this.app.fruits, (fruit) => {
                if (fruit) {
                    if (Math.abs(fruit.figure.position.x - this.figure.position.x) < 10) {
                        if (Math.abs(fruit.figure.position.y - this.figure.position.y) < 10) {
                            this.eatFruit(fruit);
                        }
                    }
                }
            });

            //Натыкаемся на бомбы
            _.each(this.app.bombs, (bomb) => {
                if (bomb) {
                    if (Math.abs(bomb.figure.position.x - this.figure.position.x) < 10) {
                        if (Math.abs(bomb.figure.position.y - this.figure.position.y) < 10) {
                            this.bombCrash(bomb);
                        }
                    }
                }
            });

            //Выходим за пределы игрового поля
            if ((this.figure.position.x < -10) || (this.figure.position.x > this.app.options.width + 10) ||
                (this.figure.position.y < -10) || (this.figure.position.y > this.app.options.height + 10)){
                this.crash();
            }
        }

        //Взрываемся
        if (this.state.isCrash) {
            this.figure.alpha -= 0.05;
            if (this.figure.alpha <= 0) {
                this.state.isCrash = false;
                this.figure.alpha = 1;
                this.speed = this.minSpeed;
                this.figure.position = {
                    x: this.app.options.width / 2,
                    y: this.app.options.height / 2,
                };
            }
        }
    }
}