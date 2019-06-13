class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, type){
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this,0);
        this.setData('type', type);
        this.setData('isDead', false);
    }

    onDestroy() {
        console.log("buarg")
       // this.setData('isDead', true);
    }

    givePoints(canScore){

    }

    explode(canDestroy){
        if(!this.getData('isDead')){
            //kaboom here => TODO

            if(this.shootTimer !== undefined){
                if(this.shootTimer){
                    this.shootTimer.remove(false);
                }
            }

            this.setAngle(0);
            this.body.setVelocity(0,0);

            if(canDestroy){
                this.destroy();
            } else {
                this.setVisible(false);
            }

            this.setData('isDead', true);
        }
    }
}

class Player extends Entity {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture, "Player");
        this.setData('speed', 700);
        this.setData('isShooting', false);
        this.setData('timerShootDelay', 10);
        this.setData('timerShootTick', this.getData('timeShootDelay')-1);
        this.setData('isHitable',true);
    }

    moveLeft(){
        this.body.velocity.x = -this.getData('speed');
    }

    moveRight(){
        this.body.velocity.x = this.getData('speed')
    }

    onDestroy(){
        console.log("t'es mort gros nul")
        super.onDestroy();
        //stuff
    }

    Hit(){
        this.scene.tweens.add({
            targets : this,
            delay : 0,
            alpha : 0,
            duration : 200,
            repeat : 5,
            yoyo : true,
            onYoyo : () => {
                this.setData('isHitable', false);
            },
            onYoyoScope : this,
            onComplete : () => {
                if(this.alpha != 1){
                    this.setAlpha(1);
                }
                this.setData('isHitable', true);
            },
            onCompleteScope : this,
        });
    }

    update() {
        this.body.setVelocity(0,0);

        this.x = Phaser.Math.Clamp(this.x, this.displayWidth/2, this.scene.game.config.width-this.width/2);

        if(this.getData('isShooting')) {
            if(this.getData('timerShootTick') < this.getData('timerShootDelay')) {
                this.setData('timerShootTick', this.getData('timerShootTick') + 1);
            }
            else {
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

class EnemyLaser extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "enemy_shot");
        this.body.velocity.y = 750;
    }
}

// class Enemy extends Entity {
//     constructor(scene, x, y, texture){
//         super(scene, x, y, texture);
//     }
// }

class GunShip extends Entity {
    constructor(scene,x, y, texture) {
        super(scene,x, y, texture, "GunShip");
        this.body.velocity.y = 300;

        this.shootTimer = this.scene.time.addEvent({
            delay : 1000,
            callback : () => {
                let laser = new EnemyLaser(
                    this.scene,
                    this.x,
                    this.y,
                );
                laser.setAngle(90).setDepth(4);
                this.scene.enemiesLasers.add(laser);
            },
            callbackScope : this,
            loop : true,
        });
    }

    onDestroy() {
        if(this.shootTimer !== undefined) {
            if(this.shootTimer) {
                this.shootTimer.remove(false)
            }
        }
    }
}