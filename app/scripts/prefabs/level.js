'use strict';

define(['phaser', 'prefabs/player', 'prefabs/enemy'], function(Phaser, Player, Enemy) {
    function Level(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'background', 0);
        // Phaser.Group.call( this, game );

    	this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background');
    	
        this.player = new Player(this.game, 400, 500);
        this.enemy = new Enemy(this.game, 700, 100);
        this.enemy2 = new Enemy(this.game, 100, 100);
    }

    Level.prototype = Object.create(Phaser.Sprite.prototype);
    Level.prototype.constructor = Level;

    Level.prototype.update = function( )
    {
    	this.background.tilePosition.y += 2;

    	this.player.update();
    	this.enemy.update(this.player.bullets);
    	this.enemy2.update(this.player.bullets);
    	// console.log(this.player.bullets);
    };

    return Level;
});
