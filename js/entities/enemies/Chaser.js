class Chaser extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.body.velocity.y = 150;
        this.setData('type', 'Chaser');
    }

    setTarget() {

    }
}
