var config, options, game;
var spawner, enemy_sprite;
var score = 0;
var lives = 3;
var shield = 100;
var spawntimer = 500;
var speed = 700;


window.onload = () => {
    config = {
        type: Phaser.CANVAS,
        scale: {
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 400,
            height: 750,
            parent: 'game',
        },
        background: 0x000000,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    x: 0,
                    y: 0,
                },
                debug: true,
            },
        },
        audio: {
            noAudio: false,
        },
        scene: [
            //Title,
            Main,
            //GameOver
        ]
    };

    game = new Phaser.Game(config);
};