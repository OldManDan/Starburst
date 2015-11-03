'use strict';

define(['phaser', 'app/config'], function(Phaser, Config) {
    function Preload() {}

    Preload.prototype = {
        preload: function() {

            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setScreenSize(true);

            var paths = Config.options.paths;

            this.game.load.image('background', paths.sprites + 'background.png');
            this.game.load.spritesheet('player', paths.sprites + 'PlayerShip.png', 71, 92);
            this.game.load.spritesheet('blueEnemy', paths.sprites + 'BlueGem.png', 57, 69);
            this.game.load.spritesheet('yellowEnemy', paths.sprites + 'YellowGem.png', 57, 69);
            this.game.load.spritesheet('yellowEnemyExplosion', paths.sprites + 'YellowGem_Explode.png', 57, 69);
            // Loading the atlas for projectiles
            this.game.load.spritesheet('ProjectileAtlas', paths.sprites + 'Projectile_Atlas.png', 32, 32)

            //var paths = Config.options.paths;
        },

        create: function() {
            this.game.state.start('gamestate');
        },

        loadUpdate: function() {
            Config.options.onLoadUpdate.call(Config, this.load.progress);
        },

        shutdown: function() {
            Config.options.onLoadComplete.call(Config);
        }
    };

    return Preload;
});
