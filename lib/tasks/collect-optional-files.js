'use strict';
const collectFiles = require('./collect-files');

function collectOptionalFiles(context, options) {
    //check for template optional files:
    if(!context.optionals) {
        return Promise.resolve(context);
    }

    let source = context.source;
    let optionals = [];

    Object.keys(context.optionals).map((optional) => {
        optionals.push(context.findOptionalsPath(optional));
    });

    return collectOptional(context, optionals).then(()=>{
        context.source = source;
        return context;
    });
}

function collectOptional(context, files) {
    return files.reduce((p, file) => {
        return p.then(()=> {
            context.source = file;
            return collectFiles(context);
        });
    }, Promise.resolve()); // initial
}
