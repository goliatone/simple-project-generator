'use strict';

const Template = require('../path-template');

const DEFAULTS = {
    openTag:  '#',
    closeTag: '#'
};

function expandFilepaths(files=[], options={}) {

    const template = new Template({
        openTag: '#',
        closeTag: '#'
    });

    return new Promise((resolve, reject)=>{
        files = files.map((file) => {
            file.dest = template.compile(file.dest, options);
            return file;
        });

        resolve(files);
    });
}


const collectFiles = require('./collect-files');

module.exports = expandFilepaths;
