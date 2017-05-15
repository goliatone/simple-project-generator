'use strict';

const tmp = require('tmp');
const extend = require('gextend');

const DEFAULTS = {
    mode: '0644',
    prefix: 'core.io-'
};

function createTmpDir(dir, options) {
    return new Promise((resolve, reject) => {
        tmp.dir(options, (err, path) => {
            if(err) reject(err);
            else resolve(path);
        });
    });
}

module.exports = createTmpDir;
