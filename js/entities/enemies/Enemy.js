class Enemy extends Entity {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }
}

class EnemyLaser extends Entity {
    constructor(scene, x, y, speed) {
        super(scene, x, y, "enemy_shot");
        this.body.velocity.y = speed;
    }
}