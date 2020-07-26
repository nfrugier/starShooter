class GunShip extends Entity {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, "GunShip");
        this.body.velocity.y = 300;

        var i = score;
        switch (true) {
            case (i < 500):
                this.firerate = Phaser.Math.Between(1500, 2000);
                break;
            case (i < 1000):
                this.firerate = Phaser.Math.Between(1000, 2000);
                break;
            case (i < 1500):
                this.firerate = Phaser.Math.Between(500, 2000);
                break;
            case (i < 2000):
                this.firerate = Phaser.Math.Between(200, 2000);
                break;
            case (i < 3000):
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
