'use strict';
const rmfr = require('rmfr');
const mkdirp = require('mkdir-promise');

function clean(target, doClean=true) {
    if(!doClean) return Promise.resolve();
    return rmfr(target).then(()=> mkdirp(target));
}

module.exports = clean;
