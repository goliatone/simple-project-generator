'use strict';

const TX = require('jstransformer');
const extend = require('gextend');
const fileType = require('istextorbinary');

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
                resolve(file);
            }

            //TODO: we might want to process imgs make this a
            //true processor manager, right now is just template manager
            if(fileType.isBinarySync(file.src)) {
                resolve(file);
            }

            getFileContent(file.src).then((content)=>{
                const trans = TX(options.template.engine);
                let output = trans.render(content, options.template.options, options.context);
                file.content = output.body;
                console.log('output', output.body);
                resolve(file);
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
            if(err) reject(err);
            else resolve(content);
        });
    });
}
