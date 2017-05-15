'use strict';

const gitconfig = require('git-config-path');
const parse = require('parse-git-config');
const extend = require('gextend');

function gitInfo(cb, options={}) {
    let user = null;
    let opts = extend({}, {cwd: '/', path: gitconfig()}, options);

    try {
        let config = parse.sync(opts);
        user = config && config.user ? config.user : null;
        if(!user && !opts.global) {
            opts.global = true;
            opts.path = gitconfig('global');
            return gitInfo(cb, opts);
        }
    } catch (err) {
        return cb(err);
    }

    return cb(null, user);
}

module.exports = gitInfo;
