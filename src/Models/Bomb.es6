import _ from 'lodash';

export default class {

    constructor(app, id, options) {
        this.id = id;
        this.app = app;

        //Options
        this.options = {
            size: _.get(options, 'size', 20),
            color: _.get(options, 'color', 0xD72100),
        };

        this._init();
    }


    _init() {
        let size =  this.options.size;
        let color =  this.options.color;

        this.figure = new PIXI.Graphics();
        this.figure.beginFill(color);
        this.figure.drawCircle(0, 0, size / 2);
        this.figure.endFill();
        this.figure.x = Math.random() * this.app.options.width;
        this.figure.y = Math.random() * this.app.options.height;
        this.app.stage.addChild(this.figure);

        this.bornAt = this.app.timer;
    }

    update() {
        //Если объект слишком старый - стираем его
        if ((this.app.timer - this.bornAt) > 120){
            this.figure.alpha -= 0.05;
            if (this.figure.alpha <= 0 ){
                this.destroy();
            }
        }
    }

    /**
     * Уничтожение
     */
    destroy(){
        _.remove(this.app.bombs, {
            id: this.id
        });

        this.app.stage.removeChild(this.figure);
    }

}