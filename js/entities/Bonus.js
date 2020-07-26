class Bonus extends Entity {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.body.velocity.y = Phaser.Math.Between(40, 500);
    }

    update() {
        this.body.setVelocity(0, 0);
        this.x = Phaser.Math.Clamp(this.x, this.displayWidth / 2, this.scene.game.config.width - this.width / 2);

    }
}