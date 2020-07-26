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

        this.load.audio('fail', 'assets/sounds/fail.wav');
        this.load.audio('theme', 'assets/sounds/starshooter_main.mp3');
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
        //groups
        this.enemies = this.add.group();
        this.playerLasers = this.add.group();
        this.enemiesLasers = this.add.group();

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
            loop: true
        });
        this.fail = this.sound.add('fail');
        this.loop.play();

        //player
        this.playerShip = new PlayerShip(this,
            game.config.width / 2,
            game.config.height * 0.9,
            'player'
        ).setDepth(5);
        ////adjusting Hitbox
        this.playerShip.body.setSize(this.playerShip.width - 40, this.playerShip.height - 40);
        this.cursors = this.input.keyboard.createCursorKeys();
        ////player's animations
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'planes_03A-',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_side',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'planes_03A-',
                start: 5,
                end: 12
            }),
            frameRate: 10,
        });

        //player's shield
        this.playerShield = new Shield(this,
            this.playerShip.x,
            this.playerShip.y,
            'shield').setDepth(10).setAlpha(shield / 100).setScale(1.25).setFrame('shield-6');
        /*this.anims.create({
            key: 'shield_idle',
            frames: this.anims.generateFrameNames('shield', {
                prefix: 'shield-',
                start: 6,
                end: 6
                //don't ask ...
            }),
            frameRate: 10,
        });*/
        this.anims.create({
            key: 'shield_anim',
            frames: this.anims.generateFrameNames('shield', {
                prefix: 'shield-',
                start: 1,
                end: 6,
            }),
            frameRate: 12,
        });

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
        ////enemiesLaser=>PlayerShield
        this.physics.add.overlap(this.enemiesLasers, this.playerShield, (enemiesLasers, playerShield) => {
            if (!playerShield.getData('isDead') &&
                playerShield.getData('isHitable')) {
                this.playerShield.shieldHitCallback(enemiesLasers, playerShield);
                shield -= 10;
                enemiesLasers.destroy();
            }
        });
        ////enemies=>playerShield
        this.physics.add.overlap(this.enemies, this.playerShield, (enemy, playerShield) => {
            if (!playerShield.getData('isDead') &&
                playerShield.getData('isHitable')) {
                shield -= 10;
                if (enemy) {
                    if (enemy.onDestroy !== undefined) {
                        enemy.onDestroy();
                    }
                    enemy.explode(true);
                }
            }
        });
        ////enemiesLaser=>PlayerShip
        this.physics.add.overlap(this.enemiesLasers, this.playerShip, (enemiesLasers, player) => {
            if (!player.getData('isDead') &&
                player.getData('isHitable') &&
                shield <= 0) {
                lives--;
                this.playerShip.Hit();
                enemiesLasers.destroy();
            }
        });
        ////enemies=>player
        this.physics.add.overlap(this.enemies, this.playerShip, (enemy, player) => {
            if (!player.getData('isDead') &&
                player.getData('isHitable') &&
                shield <= 0) {
                lives--;
                this.playerShip.Hit();
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
        this.playerShield.x = this.playerShip.x;
        this.playerShield.y = this.playerShip.y;
        this.playerShield.setAlpha(shield / 100);
        this.bg.tilePositionY -= 10;
        //update UI
        this.scoretxt.setText('Score : ' + score);
        this.shieldtxt.setText('Shield : ' + shield);

        if (shield <= 0) {
            this.playerShield.explode();
        }

        if (lives > 1) {
            this.lifetxt.setText('Lives : ' + lives);
        } else if (lives <= 0) {
            this.loop.stop();
            this.playerShip.explode();
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
        this.playerShield.x = this.playerShip.x;

        //control the spaceship
        if (this.playerShip !== null) {
            this.playerShip.update();
            this.playerShip.play('player_idle', true);
            //moving
            if (this.cursors.right.isDown) {
                this.playerShip.moveRight();
                this.playerShip.setFlipX(true);
                this.playerShip.play('player_side', true);
            } else if (this.cursors.left.isDown) {
                this.playerShip.moveLeft();
                this.playerShip.setFlipX(false);
                this.playerShip.play('player_side', true);
            }

            if (this.cursors.up.isDown) {
                this.playerShip.moveUp();
                this.playerShip.play('player_idle', true);
            } else if (this.cursors.down.isDown) {
                this.playerShip.moveDown();
                this.playerShip.play('player_idle', true);
            }

            //shooting
            if (this.cursors.space.isDown) {
                this.playerShip.setData('isShooting', true);
            } else {
                this.playerShip.setData('timerShootTick', this.playerShip.getData('timerShootDelay') - 0.1);
                this.playerShip.setData('isShooting', false);
            }
        } else {
            this.playerShip.body.velocity.x = 0;
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