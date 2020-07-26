class Shield extends PlayerShip {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.setData('isHitable', true);
    }

    shieldHitCallback(hit, target) {

        if (target.getData('isHitable')) {
            target.anims.play('shield_anim', true);
        }

    }


}