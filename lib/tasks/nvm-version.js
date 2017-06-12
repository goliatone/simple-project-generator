'use strict';
const execa = require('execa');
const path = require('path');

function npmInstall(context) {

    if(context.dryRun) {
        return Promise.resolve(context);
    }

    let target = context.target;

    context.logger.info('Running nvm install at %s', target);

    return execa.shell('nvm use', {cwd:target, stdio: 'inherit' }).then(()=> {
        return context;
    });
}

module.exports = npmInstall;
