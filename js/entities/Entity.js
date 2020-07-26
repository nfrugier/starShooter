class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData('type', type);
        this.setData('isDead', false);
    }

    onDestroy() {
        // this.setData('isDead', true);
    }

    givePoints(canScore) {

    }

    explode(canDestroy) {
        if (!this.getData('isDead')) {
            //kaboom here => TODO

            if (this.shootTimer !== undefined) {
                if (this.shootTimer) {
                    this.shootTimer.remove(false);
                }
            }

            this.setAngle(0);
            this.body.setVelocity(0, 0);

            if (canDestroy) {
                this.destroy();
            } else {
                this.setVisible(false);
            }

            this.setData('isDead', true);
        }
    }
}


