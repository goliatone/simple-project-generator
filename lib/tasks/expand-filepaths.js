'use strict';

const Template = require('../path-template');

const DEFAULTS = {
    openTag:  '#',
    closeTag: '#'
};

function expandFilepaths(context={}, options={}) {

    const template = new Template({
        openTag: '#',
        closeTag: '#'
    });

    return new Promise((resolve, reject)=>{
        context.files = context.files.map((file) => {
            console.log('options', file.dest, options, template.compile(file.dest, options));
            file.dest = template.compile(file.dest, options);
            return file;
        });
        resolve(context);
    });
}


const collectFiles = require('./collect-files');

module.exports = expandFilepaths;
