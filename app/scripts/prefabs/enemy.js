'use strict';

define(['phaser'], function(Phaser) {
    function Enemy(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'blueEnemy', 0);

        this.game = game;

        this.destination = new Phaser.Point(x, y);

        this.x = x;
        this.y = y;

        console.log("SpawnLoc: " + (((x - (game.width / 2)) * 4) + 200));
        this.enemySprite = game.add.sprite(((x - (game.width / 2)) * 4) + 400, -600, 'yellowEnemy');
        this.enemySprite.animations.add('idle');
        this.enemySprite.play('idle', 10, true);
        this.game.physics.enable(this.enemySprite, Phaser.Physics.ARCADE);

        this.enemyExplosion = game.add.sprite(-100, -100, 'yellowEnemyExplosion');
        this.enemyExplosion.anchor.setTo(0.0, 0.0);
        this.enemyExplosion.animations.add('explosion');

        this.health = 4;
        this.isActive = false;
        this.fireRate = 500;
        this.shotTimer = 0;
        this.enemyShotTimer = 4;
        this.alive = true;

        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'ProjectileAtlas', 12, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
    }

    Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.update = function( playerBullets )
    {
        if(!this.isActive && this.alive)
        {
            MoveToDestination(this);
        }
        else if(this.isActive && this.alive)
        {
            if(this.game.physics.arcade.overlap(playerBullets, this.enemySprite, Hit, null, this.game))
            {
                Damage(this);
            }

            // SingleShotFire(this);
            RadialBurst(this);
        }
    }

    function RadialBurst ( enemy )
    {
        if (enemy.game.time.now > enemy.shotTimer)
        {
            var i = 0;
            for (var deltaX = -1; deltaX <= 1; deltaX++)
            {
                for (var deltaY = -1; deltaY <= 1; deltaY++)
                {
                    if(deltaX == 0 && deltaY == 0)
                        continue;
                    else
                    {
                        // var bullet = enemy.bullets[i];
                        // bullet.reset(enemy.enemySprite.x + 30, enemy.enemySprite.y + 50);
                        // bullet.velocity.x = deltaX * 400;
                        // bullet.velocity.y = deltaY * 400;

                        var bullet = enemy.bullets.getFirstExists(false);
                        bullet.reset(enemy.enemySprite.x + 30, enemy.enemySprite.y + 50);
                        enemy.game.physics.arcade.velocityFromAngle(i * 45, 400, bullet.body.velocity);
                        // bullet.body.velocity.x = deltaX * 400;
                        // bullet.body.velocity.y = deltaY * 400;
                        ++i;
                    }
                };
            };

            enemy.shotTimer = enemy.game.time.now + enemy.fireRate;
        }
    };
    
    function SingleShotFire ( enemy )
    {
        if (enemy.game.time.now > enemy.shotTimer)
        {
            //  Grab the first bullet we can from the pool
            var bullet = enemy.bullets.getFirstExists(false);

            if (bullet)
            {
                //  And fire it
                bullet.reset(enemy.enemySprite.x + 30, enemy.enemySprite.y + 50);
                bullet.body.velocity.y = 400;
                enemy.shotTimer = enemy.game.time.now + enemy.fireRate;
            }
        }
    }

    function Hit ( enemy, bullet )
    {
        bullet.kill();
    }

    function Damage ( enemy )
    {
        console.log(enemy.health);
        enemy.health -= 1;
        if(enemy.health <= -3)
        {
            enemy.enemySprite.kill();
            enemy.alive = false;
            enemy.enemyExplosion.reset(enemy.x, enemy.y);
            enemy.enemyExplosion.play('explosion', 10, false);
        }
    }

    function MoveToDestination ( enemy )
    {
        // console.log(enemy);
        enemy.game.physics.arcade.moveToXY(enemy.enemySprite, enemy.x, enemy.y, 0, 1000);
        if(enemy.game.physics.arcade.distanceToXY(enemy.enemySprite, enemy.x, enemy.y) < 7)
        {
            enemy.enemySprite.body.velocity.x = 0;
            enemy.enemySprite.body.velocity.y = 0;
            enemy.isActive = true;
        }
    }

    return Enemy;
});
