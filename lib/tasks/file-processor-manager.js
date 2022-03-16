'use strict';

const KeyPath = require('gkeypath');
const TX = require('jstransformer');
const extend = require('gextend');
const pathType = require('path-type');
const isImage = require('is-image');
const isBinary = require('is-binary');

const DEFAULTS = {
    skipFile: function(file) {
        return false;
    },
    throwOnError: true,
    template: {
        engine: require('jstransformer-swig'),
        extendTransformer: function(tx) {

        },
        options: {
            //https://node-swig.github.io/swig-templates/docs/api/#SwigOpts
            varControls: ['%{', '}%'],
            filters: {
                randomPortNumber: function(input, idx) {
                    let startPort = 1024;
                    let maxPort = 65535;
                    let range = maxPort - startPort;
                    return startPort + parseInt(Math.random() * (range + 1));
                }
            }
        }
    }
};

function fileProcessorManager(context = {}, options = {}) {
    /**
     * Get any options set in the template config
     * object.
     */
    let settings = KeyPath.get(context, 'config.template');

    let template = extend({}, DEFAULTS.template, settings);

    options = extend({}, DEFAULTS, { template }, options);

    function check(file) {
        return new Promise((resolve, reject) => {
            if (options.skipFile(file)) {
                context.logger.warn('Skip file %s', file);
                return resolve(file);
            }

            pathType.file(file.src).then(isFile => {
                file.isFile = isFile;

                if (!isFile) {
                    // context.logger.warn('Not a file, skip %s', file.src);
                    return resolve(file);
                }

                //TODO: we might want to process imgs make this a
                //true processor manager, right now is just template manager
                if (isImage(file.src)) {
                    context.logger.warn('Skip image file %s', file.src);
                    return resolve(file);
                }

                if (isBinary(file.src)) {
                    context.logger.warn('Skip binary file %s', file.src);
                    return resolve(file);
                }

                //This should only apply to text files
                getFileContent(file.src).then(content => {
                    const trans = TX(options.template.engine);
                    let output = trans.render(content, options.template.options, context.config);
                    file.content = output.body;
                    resolve(file);
                }).catch(err => {
                    context.logger.error('Error template', err.message);
                    if (options.throwOnError) throw err;
                });
            });
        });
    }

    return Promise.all(context.files.map((file) => check(file))).then(() => {
        return context;
    });
}

module.exports = fileProcessorManager;


function getFileContent(src) {
    return new Promise((resolve, reject) => {
        require('fs').readFile(src, 'utf-8', (err, content) => {
            if (err) {
                console.log('getFileContent error', err.message);
                reject(err);
            } else resolve(content);
        });
    });
}
