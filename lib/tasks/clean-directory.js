'use strict';
const rmfr = require('rmfr');
const mkdirp = require('mkdir-promise');

function clean(context) {
    if(context.doClean === false) return Promise.resolve();
    return rmfr(context.target).then(()=>{
        return mkdirp(context.target).then(()=>context);
    });
}

module.exports = clean;
