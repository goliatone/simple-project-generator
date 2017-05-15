'use strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdir-promise');

function saveProjectFiles(context) {
    let promises = context.files.map((file) => {
        return writeFile(file, context);
    });
}

function writeFile(file, context) {
    return new Promise((resolve, reject) => {
        let dir = file.dest;

        if(file.isFile) {
            dir = path.dirname(dir);
        }
        context.logger.info('writeFile(%s)\n to %s', file.dest, dir);

        mkdirp(dir).then(()=>{
            if(context.dryRun) {
                return context.logger.info('create file: %s', file.dest);
            }

            fs.writeFile(file.dest, file.content, 'utf-8', (err) => {
                if(err) reject(err);
                else resolve(file);
            });
        });
    });
}

module.exports = saveProjectFiles;
module.exports.writeFile = writeFile;
