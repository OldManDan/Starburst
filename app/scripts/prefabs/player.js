'use strict';

define(['phaser'], function(Phaser) {
    function Player(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'player', 0);

        this.cursors = game.input.keyboard.createCursorKeys();
    	this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.dampingValue = 50;
        this.alive = true;
        this.health = 10;

        this.shotTimer = 100;
        this.fireRate = 200;
        
        this.flickerTimer1;
        this.flickerTimer2;
        this.flickerTimer3;

        // Creating player
		this.player = game.add.sprite(400, 500, 'player');
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.setSize(10, 10, 0, 0);
		this.player.anchor.setTo(0.5, 0.5);
		this.player.body.collideWorldBounds = true;
		this.player.animations.add('idle');
		this.player.animations.play('idle', 20, true)

        this.sfx_shoot = this.game.add.audio('sfx_playerShoot', 0.5, false);

		// Creating player bullets
		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(30, 'ProjectileAtlas', 43, false);
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);

    }

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.update = function( )
    {
    	// SmoothPlayerMovement(this);
    	PlayerControls(this);
    	Flicker(this);
    };

    function PlayerControls ( playerObj )
    {
    	if(playerObj.alive)
    	{
    		SmoothPlayerMovement(playerObj);
    		//  Firing?
	        if (playerObj.fireKey.isDown)
	        {
	            Shoot(playerObj);
	    	}
	    }
    }

    function SmoothPlayerMovement ( playerObj )
	{
	    // Smooth player Horizontal movement.
		var alter = 1;
	    if(playerObj.player.body.velocity.x < 0)
	    	alter = -1;

		if(playerObj.player.body.velocity.x * alter > playerObj.dampingValue)
		playerObj.player.body.velocity.x -= playerObj.dampingValue * alter;
		else if(playerObj.player.body.velocity.x * alter <= playerObj.dampingValue)
			playerObj.player.body.velocity.x = 0;		

		// Smooths playerObj.player vertical movement
		var alter = 1;
	    if(playerObj.player.body.velocity.y < 0)
	    	alter = -1;

		if(playerObj.player.body.velocity.y * alter > playerObj.dampingValue)
		playerObj.player.body.velocity.y -= playerObj.dampingValue * alter;
		else if(playerObj.player.body.velocity.y * alter <= playerObj.dampingValue)
			playerObj.player.body.velocity.y = 0;

		// Apply Horizontal velocity
	    if (playerObj.cursors.left.isDown)
	        playerObj.player.body.velocity.x = -250;
	    else if (playerObj.cursors.right.isDown)
	        playerObj.player.body.velocity.x = 250;

	    // Apply Vertical velocity
	    if(playerObj.cursors.up.isDown)
	    	playerObj.player.body.velocity.y = -250;
	    else if(playerObj.cursors.down.isDown)
	    	playerObj.player.body.velocity.y = 250;
	}

	function Shoot ( playerObj )
	{
		if (playerObj.game.time.now > playerObj.shotTimer)
    	{
    		// console.log(playerObj.game.time.now);
	        //  Grab the first bullet we can from the pool
	        var bullet = playerObj.bullets.getFirstExists(false);

	        if (bullet)
	        {
	        	playerObj.sfx_shoot.play();
	            //  And fire it
	            bullet.reset(playerObj.player.x, playerObj.player.y - 40);
	            bullet.body.velocity.y = -400;
	            playerObj.shotTimer = playerObj.game.time.now + playerObj.fireRate;
	        }
	    }
	}

	Player.prototype.CheckCollision = function( eBullets )
	{
		if(this.game.physics.arcade.overlap(eBullets, this.player, ReceiveHit, null, this.game))
		{
			Damage(this);
		}
	};

	function ReceiveHit ( player, bullet )
	{
		bullet.kill();
	}

	function Damage ( player )
	{
		console.log(player.health);
        player.health -= 1;
        if(player.health <= 0)
        {
            player.player.kill();
            player.alive = false;
            // player.playerExplosion.reset(player.x, player.y);
            // enemy.enemyExplosion.play('explosion', 10, false);
        }

		player.flickerTimer1 = player.game.time.now + 100;
		player.flickerTimer2 = player.game.time.now + 200;
		player.flickerTimer3 = player.game.time.now + 300;
		player.player.visible = false;
	}

	function Flicker ( player )
	{
		if(player.game.time.now > player.flickerTimer3)
		{
			player.player.visible = true;
		}
		else if (player.game.time.now > player.flickerTimer2)
		{
			player.player.visible = false;
		}
		else if (player.game.time.now > player.flickerTimer1)
		{
			player.player.visible = true;
		}
	}

    return Player;
});
