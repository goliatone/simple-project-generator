'use strict';
const opn = require('opn');

/**
 * Opens directory.
 * @param  {Object} context      Context Object
 * @param  {Object} [options={}] wait:true|false
 * @return {Promise}
 */
function openDirectory(context, options={}) {
    options.wait = true;

    return new Promise((resolve, reject)=>{
        context.logger.info('Open %s', context.target);
        opn(context.target, options);
        resolve(context);
    });
}

module.exports = openDirectory;
