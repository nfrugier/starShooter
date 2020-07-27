class GunShip extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.body.velocity.y = 300;
        this.setData('type', 'GunShip');


        switch (true) {
            case (score < 500):
                this.firerate = Phaser.Math.Between(1500, 2000);
                break;
            case (score < 1000):
                this.firerate = Phaser.Math.Between(1000, 2000);
                break;
            case (score < 1500):
                this.firerate = Phaser.Math.Between(500, 2000);
                break;
            case (score < 2000):
                this.firerate = Phaser.Math.Between(200, 2000);
                break;
            case (score < 3000):
                this.firerate = Phaser.Math.Between(200, 2000);
                break;
            default:
                this.firerate = 750;
                break;
        }

        this.shootTimer = this.scene.time.addEvent({
            delay: this.firerate,
            callback: () => {
                let laser = new EnemyLaser(
                    this.scene,
                    this.x,
                    this.y,
                    Phaser.Math.Between(500, 750)
                );
                laser.setAngle(90).setDepth(4);
                this.scene.enemiesLasers.add(laser);
            },
            callbackScope: this,
            loop: true,
        });
    }

    onDestroy() {
        if (this.shootTimer !== undefined) {
            if (this.shootTimer) {
                this.shootTimer.remove(false)
            }
        }
    }
}
