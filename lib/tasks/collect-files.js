'use strict';
const fileMatch = require('expand-files');

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

        config.files.map((file)=>{
            if(Array.isArray(file.src)) {
                console.log('overwrite', file.src);
                file.src = file.src[0];
            }
        });
        context.files = config.files;
        resolve(context);
    });
}

module.exports = collectFiles;
