var config, options, game;
var spawner, enemy_sprite;

window.onload = () => {
    config ={
        type : Phaser.CANVAS,
        scale : {
            autoCenter : Phaser.Scale.CENTER_BOTH,
            width : 400,
            height : 750,
            parent : 'game',
        },
        background : 0x000000,
        physics : {
            default : 'arcade',
            arcade : {
                gravity : {
                    x : 0,
                    y : 0,
                },
            },
        },
        audio : {
            noAudio : true,
        },
        scene : [Main]
    };

    game = new Phaser.Game(config);
};

class Main extends Phaser.Scene {
    constructor(){
        super({key:'Main'})
    }

    preload(){
        this.load.image("bg", "assets/bg.png");
        this.load.image("player", "assets/player.png");
        this.load.image("shot", "assets/shot.png");
        this.load.image("enemy_1", "assets/enemy_1.png");
        this.load.image("enemy_2", "assets/enemy_2.png");
        this.load.image("enemy_3", "assets/enemy_3.png");
        this.load.image("enemy_shot", "assets/enemy_shot.png");
        enemy_sprite = ["enemy_1","enemy_2","enemy_3"]
    }

    create(){
        this.bg = this.add.tileSprite(game.config.width/2,game.config.height/2,400,750,"bg").setOrigin(0.5).setDepth(1);

        this.player = new Player(this, game.config.width/2, game.config.height * 0.9, "player").setDepth(5);
        this.cursors = this.input.keyboard.createCursorKeys();

        //groups
        this.enemies = this.add.group();
        this.playerLasers = this.add.group();
        this.enemiesLasers = this.add.group();

        //spawner
        spawner = this.time.addEvent({
            delay : 500,
            callback : () => {
                var enemy = null;
                enemy = new GunShip(
                    this,
                    Phaser.Math.Between(game.config.width * 0.05, game.config.width * 0.95),
                    0,
                    enemy_sprite[Phaser.Math.Between(0,2)]
                );
                if(enemy!==null){
                    enemy.setAngle(180).setDepth(5);
                    this.enemies.add(enemy);
                    console.log('new enemy arrives');
                }
            },
            callbackScope : this,
            loop : true,
        });

        //colliders
        ////playerLaser=>Enemies
        this.physics.add.collider(this.playerLasers, this.enemies, (playerLaser, enemy)=>{
            if(enemy) {
                if(enemy.onDestroy !== undefined) {
                    enemy.onDestroy();
                }
                enemy.explode(true);
                playerLaser.destroy();
            }
        });
        ////enemiesLaser=>Player
        this.physics.add.overlap(this.enemiesLasers, this.player, (enemiesLasers, player)=> {
            if(!player.getData('isDead') &&
                player.getData('isHitable')){
                    player.Hit();
                    player.onDestroy();
                    enemiesLasers.destroy();
                }
        });
        ////enemies=>player
        this.physics.add.overlap(this.enemies, this.player, (enemy, player)=>{
            if(!player.getData('isDead') &&
                player.getData('isHitable')){
                    player.Hit();
                    player.onDestroy();
                    if(enemy) {
                        if(enemy.onDestroy !== undefined) {
                            enemy.onDestroy();
                        }
                        enemy.explode(true);
                    }
                }
        })

    }

    update(){
        this.bg.tilePositionY -= 10;
        console.log(this.player.getData('isHitable'));

        //events on enemies
        for (let i = 0; i < this.enemies.getChildren().length ; i++){
            let enemy = this.enemies.getChildren()[i];
            enemy.update();

            //frustum culling
            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight) {

                if (enemy) {
                    if (enemy.onDestroy !== undefined) {
                        enemy.onDestroy();
                    }
                    enemy.destroy();
                }
            }
        }

        //control the spaceship
        if (this.player !== null){
            this.player.update();
            //moving
            if(this.cursors.right.isDown){
                this.player.moveRight();
            } else if(this.cursors.left.isDown){
                this.player.moveLeft();
            }
            //shooting
            if (this.cursors.space.isDown) {
                this.player.setData("isShooting", true);
            }
            else {
                this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 0.1);
                this.player.setData("isShooting", false);
            }
        } else {
            this.player.body.velocity.x = 0;
        }


        for (let i = 0; i < this.playerLasers.getChildren().length; i++) {
            let laser = this.playerLasers.getChildren()[i];
            laser.update();
            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        }

        for (let i = 0; i < this.enemiesLasers.getChildren().length; i++) {
            let laser = this.enemiesLasers.getChildren()[i];
            laser.update();
            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        }
    }
}