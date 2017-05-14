'use strict';
const fileMatch = require('expand-files');

const DEFAULTS = {
    src: ['**/*'],
    options: {
        dot: true,
        nocomment: true
    }
};

function collectFiles(source, options={}) {
    return new Promise((resolve, reject) => {

        let config = fileMatch({
                cwd: source
            });

        config.expand({
            /*
             * Expand src-dest mappings.
             * Creates a dest filepath for each src filepath.
             */
            mapDest: true,
            dest: './myproject',
            src: ['**/*'],
            options: {
                dot: true,
                nocomment: true
            }
        });

        resolve(config);
    });
}

module.exports = collectFiles;
