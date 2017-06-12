'use strict';

const tmp = require('tmp');
const extend = require('gextend');

const DEFAULTS = {
    mode: '0750',
    prefix: 'core.io-',
    template: '/tmp/tmp-XXXXXX'
};

function createTmpDir(context, options) {
    options = extend({}, DEFAULTS, options);
    return new Promise((resolve, reject) => {
        tmp.dir(options, (err, path) => {
            if(err) {
                return reject(err);
            }
            context.tempTarget = path;
            resolve(context);
        });
    });
}

module.exports = createTmpDir;
