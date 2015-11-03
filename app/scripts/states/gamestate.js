'use strict';

define(['phaser', 'prefabs/level'], function(Phaser, Level) {
    function Gamestate() {}

    Gamestate.prototype = {
        preload: function() {

        },

        create: function() {
            // this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background');
            // console.log("Testing");
            
            var gamestate = this;
            this.level = new Level(this.game, 0, 0);
        },

        update: function() {
        	this.level.update();


    		 var resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    		 if(resetKey.isDown)
    		 {
    		 	this.level.bgm.stop();
    		 	this.game.state.start('gamestate');
    		 }
        }
    };

    return Gamestate;
});
