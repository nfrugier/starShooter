class GameOver extends Phaser.Scene {
    constructor() {
        super({key: "GameOver"});
    }

    preload() {

    }

    create() {
        //UI
        this.bg = this.add.tileSprite(game.config.width / 2, game.config.height / 2, 400, 750, 'bg').setOrigin(0.5).setDepth(1);
        this.gameover = this.add.text(game.config.width / 2, game.config.height / 2 -50 , 'GAME OVER', {
            color: 'yellow',
            fontFamily: 'Helvetica',
            fontSize: 35,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20);
        this.score = this.add.text(game.config.width / 2, game.config.height / 2 +50 , 'SCORE : '+score, {
            color: 'yellow',
            fontFamily: 'Helvetica',
            fontSize: 35,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20);
        this.beep = this.sound.add('beep')
        const restart = this.add.text(game.config.width / 2, game.config.height / 2, 'RESTART', {
            color: 'green',
            fontFamily: 'Helvetica',
            fontSize: 45,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true});
        restart.on('pointerdown', () => {
            this.beep.play();
            this.time.addEvent({
                delay: 1000,
                callback: ()=>{
                    lives = 3;
                    shield = 100;
                    score = 0;
                    this.scene.start('Main');
                },
                loop: false
            });
        });
    }

    update() {
    }
}