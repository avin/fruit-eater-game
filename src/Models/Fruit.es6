import _ from 'lodash';

export default class {

    constructor(app, id, options) {
        this.id = id;
        this.app = app;

        //Options
        this.size = _.get(options, 'size', 10);
        this.color = _.get(options, 'color', 0xffffff);

        this._init();
    }

    /**
     * Инициализация
     * @private
     */
    _init() {
        this.figure = new PIXI.Graphics();
        this.figure.beginFill(0x009D35);
        this.figure.drawCircle(0, 0, this.size / 2);
        this.figure.endFill();
        this.figure.x = Math.random() * this.app.options.width;
        this.figure.y = Math.random() * this.app.options.height;
        this.app.stage.addChild(this.figure);
    }

    /**
     * Обновление
     */
    update() {

    }

    /**
     * Уничтожение
     */
    destroy(){
        _.remove(this.app.fruits, {
            id: this.id
        });

        this.app.stage.removeChild(this.figure);
    }
}