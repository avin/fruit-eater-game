import Ship from './Models/Ship';
import Fruit from './Models/Fruit';
import Bomb from './Models/Bomb';
import Scoreboard from './Models/Scoreboard';

const GAME_STATES= {
    GAME_OVER: 0,
    PLAYING: 1,
    PAUSE: 2,
};

let app = {};
app.listener = new window.keypress.Listener();
app.options = {
    antialias: true,
    width: 600,
    height: 600,
};
app.timer = 0;

// create an new instance of a pixi stage
app.stage = new PIXI.Stage(0x66FF99);

// create a renderer instance.
app.renderer = PIXI.autoDetectRenderer(app.options.width, app.options.height+40, {
    antialias: app.options.antialias,
});
app.renderer.backgroundColor = 0x222222;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);

requestAnimationFrame(animate);

// ======================================
app.intervals = [];

/**
 * Начать игру
 */
app.newGame = function () {
    app.gameState = GAME_STATES.PLAYING;

    while (app.stage.children[0]) {
        app.stage.removeChild(app.stage.children[0]);
    }

    // Добавляем корабль
    app.ship = new Ship(app, {
        size: 10,
        position: {
            x: 100,
            y: 100
        }
    });

    //Каждые две секунды добавляем фрукт
    let fruitIndex = 0;
    app.fruits = [];
    app.intervals.push(setInterval(() => {
        if (app.gameState === GAME_STATES.PLAYING){
            app.fruits.push(new Fruit(app, fruitIndex, {}));
            fruitIndex++
        }
    }, 2000));

    //Каждые две секунды добавляем бомбу
    let bombIndex = 0;
    app.bombs = [];
    app.intervals.push(setInterval(() => {
        if (app.gameState === GAME_STATES.PLAYING){
            app.bombs.push(new Bomb(app, bombIndex, {}));
            bombIndex++;
        }
    }, 2000));

    // Добавляем табло очков
    app.scoreboard = new Scoreboard(app);
};

/**
 * Завершить игру
 */
app.gameOver = function () {
    app.gameState = GAME_STATES.GAME_OVER;

    while (app.stage.children[0]) {
        app.stage.removeChild(app.stage.children[0]);
    }

    //Отключаем все интрвальныей действия
    _.each(app.intervals, (intervalId) => {
        clearInterval(intervalId);
    });

    let gameOverText = new PIXI.Text(
        "Game Over",
        {font: "20px sans-serif", fill: "white"}
    );
    gameOverText.position = {
        x: app.options.width / 2 - 40,
        y: app.options.height/2 - 40,
    };
    app.stage.addChild(gameOverText);

    let scoreText = new PIXI.Text(
        "Your score: " + app.ship.state.score,
        {font: "18px sans-serif", fill: 0xAAAAAA}
    );
    scoreText.position = {
        x: app.options.width / 2 - 40,
        y: app.options.height/2,
    };
    app.stage.addChild(scoreText);

    let pressAnyKeyText = new PIXI.Text(
        "Press space to restart!",
        {font: "15px sans-serif", fill: 0x666666}
    );
    pressAnyKeyText.position = {
        x: app.options.width / 2 - 65,
        y: app.options.height/2 + 40,
    };
    app.stage.addChild(pressAnyKeyText);
};

/**
 * Поставит на паузу
 */
app.pauseGame = function () {
    if (app.gameState === GAME_STATES.PLAYING) {
        app.gameState = GAME_STATES.PAUSE;

        app.pauseText = new PIXI.Text(
            "PAUSE",
            {font: "30px sans-serif", fill: 0xAAAAAA}
        );
        app.pauseText.position = {
            x: app.options.width / 2 - 40,
            y: app.options.height/2,
        };
        app.stage.addChild(app.pauseText);
    }
};

/**
 * Убрать с паузы
 */
app.resumeGame = function () {
    if (app.gameState === GAME_STATES.PAUSE){
        app.gameState = GAME_STATES.PLAYING;

        app.stage.removeChild(app.pauseText);
    }
};

app.newGame();

// ======================================

function animate() {

    requestAnimationFrame(animate);

    //Рендерим картинку
    app.renderer.render(app.stage);

    //Обновляем состояния фигур
    if (app.gameState == GAME_STATES.PLAYING){
        app.timer++;

        app.ship.update();
        _.each(app.bombs, (bomb) => {
            if (bomb){
                bomb.update();
            }
        });
    }

}

// ======================================
// CONTROL
// ======================================

app.listener.simple_combo("shift s", function () {
    console.log("You pressed shift and s");
});

app.listener.register_many([
    {
        "keys"          : "w",
        "is_exclusive"  : true,
        "on_keydown"    : function() {
            app.ship.state.move.up = true;
        },
        "on_keyup"      : function(e) {
            app.ship.state.move.up = false;
        },
    },
    {
        "keys"          : "s",
        "is_exclusive"  : true,
        "on_keydown"    : function() {
            app.ship.state.move.down = true;
        },
        "on_keyup"      : function(e) {
            app.ship.state.move.down = false;
        },
    },
    {
        "keys"          : "a",
        "is_exclusive"  : true,
        "on_keydown"    : function() {
            app.ship.state.move.left = true;
        },
        "on_keyup"      : function(e) {
            app.ship.state.move.left = false;
        },
    },
    {
        "keys"          : "d",
        "is_exclusive"  : true,
        "on_keydown"    : function() {
            app.ship.state.move.right = true;
        },
        "on_keyup"      : function(e) {
            app.ship.state.move.right = false;
        },
    },
    {
        "keys"          : "space",
        "is_exclusive"  : true,
        "on_keydown"      : function(e) {
            switch (app.gameState){
                case GAME_STATES.GAME_OVER:
                    app.newGame();
                    break;
                case GAME_STATES.PAUSE:
                    app.resumeGame();
                    break;
                case GAME_STATES.PLAYING:
                    app.pauseGame();
                    break;
            }
        },
    }
]);

//Ставим на паузу если свернули браузер
document.addEventListener("visibilitychange", (vis) => {
    if (app.gameState == GAME_STATES.PLAYING){
        app.pauseGame();
    }
}, false);