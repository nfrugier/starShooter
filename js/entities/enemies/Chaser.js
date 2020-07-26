class Chaser extends Entity {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, "Chaser");
        this.body.velocity.y = 150;
    }
}
