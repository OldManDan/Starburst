'use strict';

define(['phaser', 'prefabs/player', 'prefabs/enemy'], function(Phaser, Player, Enemy) {
    function Level(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'background', 0);
        // Phaser.Group.call( this, game );

        this.bgm = game.add.audio('sfx_bgm', 0.5, true);
       	this.bgm.play();

    	this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background');

        this.player = new Player(this.game, 400, 500);

    	this.currentWave = 0;
    	this.waveDelay = 3000;
    	this.nextWaveTimer = 0;
    	this.delaying = false;
    	
    	// Wave 1
    	this.waves = [];

    	this.wave1Enemies = [];

    	this.wave1Enemies.push(new Enemy(this.game, 100, 100, 0));
    	this.wave1Enemies.push(new Enemy(this.game, 650, 100, 0));
    	this.wave1Enemies.push(new Enemy(this.game, 375, 50, 0));

    	for (var i = this.wave1Enemies.length - 1; i >= 0; i--) {
    		this.wave1Enemies[i].activate = true;
    	};

    	this.waves.push(this.wave1Enemies);

    	// Wave 2
    	this.wave2Enemies = [];

    	this.wave2Enemies.push(new Enemy(this.game, 150, 150, 0));
    	this.wave2Enemies.push(new Enemy(this.game, 660, 150, 0));
    	this.wave2Enemies.push(new Enemy(this.game, 375, 50, 1));

    	this.waves.push(this.wave2Enemies);

    	// Wave 3
    	this.wave3Enemies = [];
    	this.wave3Enemies.push(new Enemy(this.game, 100, 100, 1));
    	this.wave3Enemies.push(new Enemy(this.game, 650, 100, 1));
    	this.wave3Enemies.push(new Enemy(this.game, 250, 50, 0));
    	this.wave3Enemies.push(new Enemy(this.game, 500, 50, 0));

    	this.waves.push(this.wave3Enemies);

    }

    Level.prototype = Object.create(Phaser.Sprite.prototype);
    Level.prototype.constructor = Level;

    Level.prototype.update = function( )
    {
    	this.background.tilePosition.y += 2;

    	this.player.update();

    	for (var i = this.waves[this.currentWave].length - 1; i >= 0; i--)
    	{
    		this.waves[this.currentWave][i].update(this.player.bullets);
    		this.player.CheckCollision(this.waves[this.currentWave][i].bullets);
    	};

    	HandleWaves(this);
    	// this.enemy.update(this.player.bullets);
    	// this.enemy2.update(this.player.bullets);
    	// console.log(this.player.bullets);
    };

    function HandleWaves ( level )
    {
    	if(!level.delaying)
    	{
    		for (var i = level.waves[level.currentWave].length - 1; i >= 0; i--)
	    	{
	    		// console.log(level.waves[level.currentWave][0]);
	    		if(level.waves[level.currentWave][i].alive)
	    		{
	    			return;
	    		}
	    		// level.waves[level.currentWave]
	    	};
	    	level.nextWaveTimer = level.game.time.now + level.waveDelay;
    		level.delaying = true;
    	}
    	
    	if(level.game.time.now >= level.nextWaveTimer)
    	{
    		level.delaying = false;
    		for (var i = level.waves[level.currentWave].length - 1; i >= 0; i--)
    		{
				level.waves[level.currentWave][i].enemyExplosion.kill();
			};

			++level.currentWave;

			for (var i = level.waves[level.currentWave].length - 1; i >= 0; i--)
			{
				level.waves[level.currentWave][i].activate = true;
			};
    	}

    	// This will only execute if all enemies in the current wave are dead.

		
    }

    return Level;
});
