class Title extends Phaser.Scene {
    constructor() {
        super({key: 'Title'});
    }

    preload() {
        this.load.audio('beep', 'assets/sounds/beep.wav');
        this.load.audio('bonusSFX', 'assets/sounds/bonus.wav');
        this.load.audio('fail', 'assets/sounds/fail.wav');
        this.load.audio('theme', 'assets/sounds/starshooter_main.mp3');

        this.load.image('shot', 'assets/images/player/shot.png');

        this.load.image('enemy_1', 'assets/images/enemies/enemy_1.png');
        this.load.image('enemy_2', 'assets/images/enemies/enemy_2.png');
        this.load.image('enemy_3', 'assets/images/enemies/enemy_3.png');
        this.load.image('enemy_shot', 'assets/images/enemies/enemy_shot.png');
        enemy_sprite = ['enemy_1', 'enemy_2', 'enemy_3']

        this.load.image('bonusShield', 'assets/images/bonuses/shield.png');
        this.load.image('bonusPower', 'assets/images/bonuses/powerUp.png');

        this.load.image('bg', 'assets/images/bg.png');
        this.load.multiatlas(
            'player',
            'assets/images/player/player_atlas.json',
            'assets/images/player');
        this.load.multiatlas(
            'shield',
            'assets/images/shield/shield_atlas.json',
            'assets/images/shield'
        )


    }

    create() {
        //UI
        this.bg = this.add.tileSprite(game.config.width / 2, game.config.height / 2, 400, 750, 'bg').setOrigin(0.5).setDepth(1);
        this.title = this.add.text(game.config.width / 2, game.config.height / 2 - 50, 'Star Shooter', {
            color: 'yellow',
            fontFamily: 'Helvetica',
            fontSize: 35,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20);
        this.beep = this.sound.add('beep')
        const start = this.add.text(game.config.width / 2, game.config.height / 2, 'START', {
            color: 'green',
            fontFamily: 'Helvetica',
            fontSize: 45,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20).setInteractive({useHandCursor: true});
        start.on('pointerdown', () => {
            this.beep.play();
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    this.scene.start('Main');
                },
                loop: false
            });
        });
    }

    update() {
        this.bg.tilePositionY -= 10;
    }
}