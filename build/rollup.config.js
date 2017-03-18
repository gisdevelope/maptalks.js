const rollup = require('rollup'),
    watch = require('rollup-watch'),
    commonjs = require('rollup-plugin-commonjs'),
    nodeResolve = require('rollup-plugin-node-resolve'),
    localResolve = require('rollup-plugin-local-resolve'),
    babel = require('rollup-plugin-babel'),
    alias = require('rollup-plugin-alias');

const config = {
    plugins: [
        alias(require('./alias')),
        localResolve(),
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        commonjs(),
        babel({
            plugins : ['transform-proto-to-assign']
        })
    ],
    'sourceMap': false
};

module.exports = {
    watch(cb) {
        var rTimeout;
        const pkg = require('../package.json');
        const year = new Date().getFullYear();
        var banner = `/*!\n * ${pkg.name} v${pkg.version}\n * LICENSE : ${pkg.license}\n * (c) 2016-${year} maptalks.org\n */`;
        config.entry = 'src/maptalks.js';
        config.dest = 'dist/maptalks.js';
        config.format = 'umd';
        config.moduleName = 'maptalks';
        config.banner = banner;
        const watcher = watch(rollup, config);
        watcher.on('event', e => {
            console.log('[ROLLUP]', e.code);
            if (e.code === 'BUILD_START') {
                console.time('ROLLUP');
            } else if (e.code === 'BUILD_END') {
                clearTimeout(rTimeout);
                rTimeout = setTimeout(() => {
                    console.timeEnd('ROLLUP');
                    cb();
                }, 500);
            }
        });
    },

    config : config
};