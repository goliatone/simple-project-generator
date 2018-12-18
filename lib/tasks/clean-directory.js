'use strict';
const rmfr = require('rmfr');
const mkdirp = require('mkdir-promise');

function clean(context) {
    if (context.dryRun === false) {
        context.logger.info('Clean up target directory "%s"', context.target);
        return Promise.resolve(context);
    }

    context.logger.info('Clean directory %s', context.target);

    return rmfr(context.target).then(() => {
        return mkdirp(context.target).then(() => context);
    });
}

module.exports = clean;