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
        context.logger.info('writeFile(%s)\n%s', file.dest, file.content);

        let dir = file.dest;

        if(file.isFile) {
            dir = path.dirname(dir);
        }

        mkdirp(dir).then(()=>{
            fs.writeFile(file.dest, file.content, 'utf-8', (err) => {
                if(err) reject(err);
                else resolve(file);
            });
        });
    });
}

module.exports = saveProjectFiles;
module.exports.writeFile = writeFile;
