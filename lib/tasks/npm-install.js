'use strict';
const execa = require('execa');

function npmInstall(context) {

    if(context.noNpm) {
        return Promise.resolve(context);
    }

    if(context.dryRun) {
        return Promise.resolve(context);
    }
    //TODO we could output stdout
    //const stream = execa('echo', ['foo']).stdout;
    //stream.pipe(process.stdout);
    return execa.shell('npm i', {cwd: context.target}).then(()=>{
        return context;
    });
}

module.exports = npmInstall;
