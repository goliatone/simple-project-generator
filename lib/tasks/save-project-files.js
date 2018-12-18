'use strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdir-promise');

function saveProjectFiles(context) {
    return Promise.all(context.files.map((file) => {
        return writeFile(file, context);
    })).then(() => {
        return context;
    });
}

function writeFile(file, context) {
    return new Promise((resolve, reject) => {
        let dir = file.dest;

        if (file.isFile) {
            dir = path.dirname(dir);
        }
        // context.logger.info('writeFile(%s)\n to %s', file.dest, dir);

        mkdirp(dir).then(() => {
            if (context.dryRun) {
                // context.logger.info('create file: %s', file.dest);
                return resolve(file);
            }

            if (!file.isFile) {
                context.logger.warn('Skip create file: %s', file.dest);
                return resolve(file);
            }

            let o = {
                flag: 'w',
                mode: file.stats.mode,
                encoding: 'utf-8'
            };

            fs.writeFile(file.dest, file.content || '', o, (err) => {
                if (err) {
                    context.logger.error('Error processing file %s', file.src);
                    reject(err);
                } else resolve(file);
            });
        }).catch((err) => {
            context.logger.error('Error mkdirp', err.message);
            reject(err);
        });
    });
}

module.exports = saveProjectFiles;
module.exports.writeFile = writeFile;