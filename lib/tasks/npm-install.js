'use strict';
const execa = require('execa');
const path = require('path');

function npmInstall(context) {

    if(context.noNpm) {
        return Promise.resolve(context);
    }

    if(context.dryRun) {
        return Promise.resolve(context);
    }

    let target = context.getPackageFile().dest;
    target = path.dirname(target);

    context.logger.info('Running npm install at %s', target);

    //TODO we could output stdout
    //const stream = execa('echo', ['foo']).stdout;
    //stream.pipe(process.stdout);
    return execa.shell('npm i', {cwd:target, stdio: 'inherit' }).then(()=> {
        return context;
    });
}

module.exports = npmInstall;
