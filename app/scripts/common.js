require.config({
    baseUrl: 'scripts/',
    paths: {
        app: '../scripts',
        states: '../scripts/states',
        almond: 'almond/almond',
        'phaser': '../bower_components/phaser-official/build/phaser',
        requirejs: 'requirejs/require'
    },
    shim: {
        phaser: {
            exports: 'Phaser'
        }
    }
});
