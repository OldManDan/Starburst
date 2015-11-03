'use strict';

define(['phaser', 'app/config',
        'states/boot',
        'states/preload',
        'states/gamestate'], function(Phaser,
                                    Config,
                                    BootState,
                                    PreloadState,
                                    Gamestate
                                   ) {
    function Game(options) {
        this.config = Config;
        
        Config.options = options || Config.options;
    }

    Game.prototype = {

        start: function() {
            var game = new Phaser.Game(800, 600, Phaser.AUTO, Config.options.parent);

            game.state.add('boot', BootState);
            game.state.add('preload', PreloadState);
            game.state.add('gamestate', Gamestate);

            game.state.start('boot');

            this.game = game;
        },

        destroy: function() {
            this.game.destroy();
        },

        goFullScreen: function() {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            
            if (this.game.scale.isFullScreen) {
                this.game.scale.stopFullScreen();
            } else {
                this.game.scale.startFullScreen();
            }
        }
    };

    return Game;
});
