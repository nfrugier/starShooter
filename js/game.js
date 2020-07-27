var config, options, game;
var enemySpawner, enemy_sprite;
var bonusesSpawner;
var score = 0;
var lives = 3;
var shield = 100;
var spawntimer = 500;
var speed = 700;
var isMobile;
var pointer, keyboard;

window.onload = () => {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    )
    {
        console.log('%c Mobile device is detected', 'background: green; color:white; display:block;');
        isMobile = true;
    } else {
        console.log('%c Desktop device is detected', 'background: green; color:white; display:block;');
        isMobile = false;
    }

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
                debug: false,
            },
        },
        audio: {
            noAudio: false,
        },
        scene: [
            Title,
            Main,
            GameOver
        ]
    };

    game = new Phaser.Game(config);
};