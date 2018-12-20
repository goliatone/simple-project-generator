'use strict';
const execa = require('execa');
const path = require('path');
const ProjectTemplate = require('../project-template');

function npmInstall(context) {

    if (context.noNpm) {
        return Promise.resolve(context);
    }

    if (context.dryRun) {
        return Promise.resolve(context);
    }

    // if (context.npmCache) {
    //     const pkg = context.getPackageFile(true);

    //     const cacheName = `${pkg.name}@${pkg.version}`;
    //     const cachePath = 
    //     const tpl = new ProjectTemplate({
    //         cachePath: context.cachePath
    //     });
    //     tpl.link(source, { force: context.force })
    // }

    let target = context.getPackageFile().dest;
    target = path.dirname(target);

    context.logger.info('Running npm install at %s', target);

    //TODO we could output stdout
    //const stream = execa('echo', ['foo']).stdout;
    //stream.pipe(process.stdout);
    return execa.shell('npm i', { cwd: target, stdio: 'inherit' }).then(_ => {
        return context;
    });
}

module.exports = npmInstall;