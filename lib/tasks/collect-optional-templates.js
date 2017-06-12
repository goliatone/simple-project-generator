'use strict';
const collectFiles = require('./collect-files');

function collectOptionalFiles(context, options) {
    //check for template optional files:
    if(!context.optionals) {
        console.log('Reject no optionals');
        return Promise.resolve(context);
    }

    let source = context.source;
    let optionals = context.collectOptionalTemplates('templates');

    return new Promise(function(res, rej) {
         let stepper = createStepFunction(optionals, (err)=>{
             if(err){
                 return rej(err);
             }

             context.source = source;
             res(context);
         });
         stepper(context);
    });
}

function createStepFunction(files, done){
    return function step(context) {
        let file = files.shift();
        if(!file) {
            return done();
        }
        context.source = file;
        collectFiles(context).then(step).catch(done);
    };
}
module.exports = collectOptionalFiles;
