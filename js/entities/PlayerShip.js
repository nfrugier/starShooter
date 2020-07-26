class PlayerShip extends Entity {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, "PlayerShip");
        this.setData('speed', 700);
        this.setData('isShooting', false);
        this.setData('timerShootDelay', 10);
        this.setData('timerShootTick', this.getData('timeShootDelay') - 1);
        this.setData('isHitable', true);
    }

    onDestroy() {
        super.onDestroy();
        //stuff
    }

    Hit() {
        if (this.getData('isHitable') === true) {
            this.scene.tweens.add({
                targets: this,
                delay: 0,
                alpha: 0,
                duration: 300,
                repeat: 5,
                yoyo: true,
                onYoyo: () => {
                    this.setData('isHitable', false);
                },
                onYoyoScope: this,
                onComplete: () => {
                    this.setAlpha(1);
                    this.setData('isHitable', true);
                },
                onCompleteScope: this,
            });
        }
    }
    moveLeft() {
        this.body.velocity.x = -speed;
    }

    moveRight() {
        this.body.velocity.x = speed;
    }

    moveUp() {
        this.body.velocity.y = -speed;
    }

    moveDown() {
        this.body.velocity.y = speed;
    }

    update() {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, this.displayWidth / 2, this.scene.game.config.width - this.width / 2);
        this.y = Phaser.Math.Clamp(this.y, this.displayHeight / 2, this.scene.game.config.height - this.height / 2);

        if (this.getData('isShooting')) {
            if (this.getData('timerShootTick') < this.getData('timerShootDelay')) {
                this.setData('timerShootTick', this.getData('timerShootTick') + 1);
            } else {
                let playerLaser = new PlayerLaser(this.scene, this.x, this.y - this.height / 2).setDepth(4).setAngle(-90);
                this.scene.playerLasers.add(playerLaser);
                this.setData('timerShootTick', 0);
            }
        }
    }
}

class PlayerLaser extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "shot");
        this.body.velocity.y = -750;
    }
}