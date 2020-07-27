class Main extends Phaser.Scene {
    constructor() {
        super({key: 'Main'})
    }

    preload() {

    }

    create() {
        //groups
        this.enemies = this.add.group();
        this.playerLasers = this.add.group();
        this.enemiesLasers = this.add.group();
        this.bonuses = this.add.group();

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
        this.pew = this.sound.add('playerShot');
        this.bonusSFX = this.sound.add('bonusSFX');
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
        this.anims.create({
            key: 'shield_anim',
            frames: this.anims.generateFrameNames('shield', {
                prefix: 'shield-',
                start: 1,
                end: 6,
            }),
            frameRate: 12,
        });

        //enemies' animation
        this.anims.create({
           key: 'kaboom',
           frames: this.anims.generateFrameNames('explosion',{
               prefix: 'explosion-',
               start: 1,
               end: 11
               }),
            frameRate: 16
        });

        //spawners
        ////enemies
        enemySpawner = this.time.addEvent({
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
        ////bonuses
        bonusesSpawner = this.time.addEvent({
            delay: 3000,
            callback: () => {
                var bonus = null;
                var randomiser = Phaser.Math.Between(0,10);
                if( randomiser >= 8) {
                    bonus = new Bonus(
                        this,
                        Phaser.Math.Between(game.config.width * 0.05, game.config.width * 0.95),
                        0,
                        'bonusPower'
                    );
                    bonus.setData('type', 'power');
                } else if (randomiser >= 4) {
                    bonus = new Bonus(
                        this,
                        Phaser.Math.Between(game.config.width * 0.05, game.config.width * 0.95),
                        0,
                        'bonusShield'
                    );
                    bonus.setData('type', 'shield');
                }
                if (bonus !== null) {
                    bonus.setDepth(6).setScale(1.2);
                    this.bonuses.add(bonus);
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
                var explosion = new Explosion(this ,enemy.x, enemy.y, 'explosion').setVisible(true).setDepth(50);
                explosion.play('kaboom');
                explosion.once('animationcomplete', () => {
                    explosion.destroy();
                })
                enemy.explode(true);
                playerLaser.destroy();
                score += 50;
            }
        });
        ////enemiesLaser=>PlayerShield
        this.physics.add.overlap(this.enemiesLasers, this.playerShield, (enemiesLasers, playerShield) => {
            if (shield > 0 &&
                playerShield.getData('isHitable')) {
                this.playerShield.shieldHitCallback(enemiesLasers, playerShield);
                shield -= 10;
                enemiesLasers.destroy();
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
                player.getData('isHitable'))
            {
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
        ////bonuses=>player
        this.physics.add.overlap(this.bonuses, this.playerShield, (bonus, player) => {
            if (!player.getData('isDead')) {
                this.bonusSFX.play();
                switch (bonus.getData('type')) {
                    case('shield'):
                        if (shield <= 150) {
                            shield += 20;
                        }
                        this.playerShield.shieldHitCallback(bonus, player);
                        bonus.explode(true);
                        break;
                    case('power'):
                        if (lives <= 5) {
                            lives++;
                        }
                        score += 250;
                        bonus.explode(true);
                        break;
                    default:
                        break;
                }
            }
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

        shield = (shield >= 150) ? 150 : shield;
        lives = (lives >= 5) ? 5 : lives;

        if (shield <= 0) {
            // TODO
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

        this.cleanEntity(this.playerLasers);
        this.cleanEntity(this.enemiesLasers);
        this.cleanEntity(this.enemies);
    }

    cleanEntity(entity) {
        for (let i = 0; i < entity.getChildren().length; i++) {
            let unit = entity.getChildren()[i];
            unit.update();
            if (unit.x < -unit.displayWidth ||
                unit.x > this.game.config.width + unit.displayWidth ||
                unit.y < -unit.displayHeight * 4 ||
                unit.y > this.game.config.height + unit.displayHeight) {
                if (unit) {
                    if (unit.onDestroy !== undefined) {
                        unit.onDestroy();
                    }
                    unit.destroy();
                }
            }
        }
    }
}