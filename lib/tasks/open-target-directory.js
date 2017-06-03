'use strict';
const opn = require('opn');

function openDirectory(context) {

    return new Promise((resolve, reject)=>{
        context.logger.info('Open %s', context.target);
        opn(context.target);
        resolve(context);
    });
}

module.exports = openDirectory;
