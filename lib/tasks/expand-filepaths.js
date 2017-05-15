'use strict';

const Template = require('../path-template');

const DEFAULTS = {
    openTag:  '#',
    closeTag: '#',
};

function expandFilepaths(context={}) {

    const template = new Template({
        openTag: '#',
        closeTag: '#'
    });

    return new Promise((resolve, reject)=>{
        context.files = context.files.map((file) => {
            context.logger.info.log('context.config', file.dest, context.config, template.compile(file.dest, context.config));
            file.dest = template.compile(file.dest, context.config);
            return file;
        });
        resolve(context);
    });
}


const collectFiles = require('./collect-files');

module.exports = expandFilepaths;
