'use strict';
const fileMatch = require('expand-files');
const fs = require('fs');

const DEFAULTS = {
    src: ['**/*', '!.DS_Store'],
    options: {
        dot: true,
        nocomment: true
    }
};

function collectFiles(context, options={}) {

    return new Promise((resolve, reject) => {

        let config = fileMatch({
                cwd: context.source
            });

        config.expand({
            /*
             * Expand src-dest mappings.
             * Creates a dest filepath for each src filepath.
             */
            mapDest: true,
            dest: context.target,
            src: ['**/*'],
            options: {
                dot: true,
                nocomment: true
            }
        });

        /*
         * @TODO: We should make a promise all
         * here, and use fs.lstat with promisify.
         */
        config.files.map((file) => {
            if(Array.isArray(file.src)) {

                file.src = file.src[0];

                /*
                 * Add stats metadata, useful to
                 * keep the execute permissions
                 * on the final file.
                 */
                file.stats = fs.lstatSync(file.src);
            }
        });

        if(!context.files) {
            context.files = [];
        }

        context.files = context.files.concat(config.files);

        resolve(context);
    });
}

module.exports = collectFiles;
