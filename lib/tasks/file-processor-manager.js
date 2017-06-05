'use strict';

const TX = require('jstransformer');
const extend = require('gextend');
const fileType = require('istextorbinary');
const pathType = require('path-type');
const lstatSync = require('fs').lstatSync;

const DEFAULTS = {
    skipFile: function(file) {
        return false;
    },
    template: {
        engine:require('jstransformer-swig'),
        options: {
            //https://node-swig.github.io/swig-templates/docs/api/#SwigOpts
            varControls: ['%{', '}%']
        }
    }
};

function fileProcessorManager(context={}, options={}) {
    options = extend({}, DEFAULTS, options);

    function check(file) {
        return new Promise((resolve, reject)=>{
            if(options.skipFile(file)) {
                console.log('Skip file %s', file);
                return resolve(file);
            }

            pathType.file(file.src).then((isFile) => {
                file.isFile = isFile;
                console.log('isFile', isFile, file.src);

                //TODO: we might want to process imgs make this a
                //true processor manager, right now is just template manager
                if(fileType.isBinarySync(file.src)) {
                    console.log('Skip binary file %s', file.src);
                    return resolve(file);
                }

                if(!isFile) {
                    console.log('Not a file, skip %s', file.src);
                    return resolve(file);
                }

                getFileContent(file.src).then((content)=>{
                    const trans = TX(options.template.engine);
                    let output = trans.render(content, options.template.options, context.config);
                    file.content = output.body;
                    resolve(file);
                }).catch((err)=>{
                    context.logger.error('Error template', err.message);
                });
            });
        });
    }

    return Promise.all(context.files.map((file)=> check(file))).then(()=>{
        return context;
    });
}

module.exports = fileProcessorManager;


function getFileContent(src) {
    return new Promise((resolve, reject)=>{
        require('fs').readFile(src, 'utf-8', (err, content) => {
            if(err) {
                console.log('getFileContent error', err.message);
                reject(err);
            }
            else resolve(content);
        });
    });
}
