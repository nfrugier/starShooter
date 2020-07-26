class Main extends Phaser.Scene {
    constructor() {
        super({key: 'Main'})
    }

    preload() {
        this.load.image('shot', 'assets/images/player/shot.png');
        this.load.image('enemy_1', 'assets/images/enemies/enemy_1.png');
        this.load.image('enemy_2', 'assets/images/enemies/enemy_2.png');
        this.load.image('enemy_3', 'assets/images/enemies/enemy_3.png');
        this.load.image('enemy_shot', 'assets/images/enemies/enemy_shot.png');
        enemy_sprite = ['enemy_1', 'enemy_2', 'enemy_3']
    }

    create() {
        //UI
        this.bg = this.add.tileSprite(game.config.width / 2, game.config.height / 2, 400, 750, 'bg').setOrigin(0.5).setDepth(1);
        this.scoretxt = this.add.text(20, 20, 'Score : ' + score, {
            color: 'yellow',
            fontFamily: 'Helvetica'
        }).setOrigin(0).setDepth(20);
        this.shieldtxt = this.add.text(20, 40, 'Shield : ' + shield, {
            color: 'yellow',
            fontFamily: 'Helvetica'
        }).setOrigin(0).setDepth(20);
        this.lifetxt = this.add.text(game.config.width - 70, 20, 'Lives : ' + lives, {
            color: 'yellow',
            fontFamily: 'Helvetica'
        }).setOrigin(0).setDepth(20);

        //sounds
        this.loop = this.sound.add('theme', {
            volume: 0.5,
            loop: true});
        this.fail = this.sound.add('fail');
        this.loop.play();

        //player
        this.player = new Player(this, game.config.width / 2, game.config.height * 0.9, 'player').setDepth(5);
        this.cursors = this.input.keyboard.createCursorKeys();

        //groups
        this.enemies = this.add.group();
        this.playerLasers = this.add.group();
        this.enemiesLasers = this.add.group();

        //spawner
        spawner = this.time.addEvent({
            delay: spawntimer,
            callback: () => {
                var enemy = null;
                if (Phaser.Math.Between(0, 10) >= 3) {
                    enemy = new GunShip(
                        this,
                        Phaser.Math.Between(game.config.width * 0.05, game.config.width * 0.95),
                        0,
                        enemy_sprite[Phaser.Math.Between(0, 1)]
                    );
                } else if (Phaser.Math.Between(0, 10) >= 5) {
                    enemy = new Chaser(
                        this,
                        Phaser.Math.Between(game.config.width * 0.05, game.config.width * 0.95),
                        0,
                        enemy_sprite[2]
                    );
                }
                if (enemy !== null) {
                    enemy.setAngle(180).setDepth(5);
                    this.enemies.add(enemy);
                }
            },
            callbackScope: this,
            loop: true,
        });

        //colliders
        ////playerLaser=>Enemies
        this.physics.add.collider(this.playerLasers, this.enemies, (playerLaser, enemy) => {
            if (enemy) {
                if (enemy.onDestroy !== undefined) {
                    enemy.onDestroy();
                }
                enemy.explode(true);
                playerLaser.destroy();
                score += 50;
            }
        });
        ////enemiesLaser=>Player
        this.physics.add.overlap(this.enemiesLasers, this.player, (enemiesLasers, player) => {
            if (!player.getData('isDead') &&
                player.getData('isHitable')) {
                shield -= 10;
                enemiesLasers.destroy();
            }
        });
        ////enemies=>player
        this.physics.add.overlap(this.enemies, this.player, (enemy, player) => {
            if (!player.getData('isDead') &&
                player.getData('isHitable')) {
                shield -= 15;
                if (enemy) {
                    if (enemy.onDestroy !== undefined) {
                        enemy.onDestroy();
                    }
                    enemy.explode(true);
                }
            }
        });
        ////playerlaser=>enemylaser
        this.physics.add.overlap(this.playerLasers, this.enemiesLasers, (playerLaser, enemyLaser) => {
            playerLaser.destroy();
            enemyLaser.destroy();
        })

    }

    update() {
        this.bg.tilePositionY -= 10;
        this.scoretxt.setText('Score : ' + score);
        this.shieldtxt.setText('Shield : ' + shield);

        if (shield <= 0) {
            this.player.Hit();
            --lives;
            shield = 100;
        }

        if (lives > 1) {
            this.lifetxt.setText('Lives : ' + lives);
        } else if (lives <= 0) {
            this.loop.stop();
            this.scene.pause('Main')
            this.youLose = this.add.text(game.config.width / 2, game.config.height / 2, 'YOU LOSE', {
                color: 'yellow',
                fontFamily: 'Helvetica',
                fontSize: 50,
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(20);
            this.fail.play()
            this.scene.start('GameOver');
            this.scene.stop('Main');
        } else {
            this.lifetxt.setText('Life : ' + lives);
        }

        //events on enemies
        for (let i = 0; i < this.enemies.getChildren().length; i++) {
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
        if (this.player !== null) {
            this.player.update();
            //moving
            if (this.cursors.right.isDown) {
                this.player.moveRight();
            } else if (this.cursors.left.isDown) {
                this.player.moveLeft();
            }

            if (this.cursors.up.isDown) {
                this.player.moveUp();
            } else if (this.cursors.down.isDown) {
                this.player.moveDown();
            }

            //shooting
            if (this.cursors.space.isDown) {
                this.player.setData('isShooting', true);
            } else {
                this.player.setData('timerShootTick', this.player.getData('timerShootDelay') - 0.1);
                this.player.setData('isShooting', false);
            }
        } else {
            this.player.body.velocity.x = 0;
        }

        this.cleanLasers(this.playerLasers);
        this.cleanLasers(this.enemiesLasers)
    }

    cleanLasers(entity) {
        for (let i = 0; i < entity.getChildren().length; i++) {
            let laser = entity.getChildren()[i];
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