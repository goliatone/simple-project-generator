'use strict';
const path = require('path');
const extend = require('gextend');
const ProjectTemplate = require('./project-template');
const fs = require('fs');

const DEFAULTS = {
    logger: console,
    //We should be able to specify this in the
    //template project package.json or config.json
    promptFile: 'prompt.js',
    middleware: [
        './tasks/collect-prompt',
        './tasks/collect-files',
        //TODO: rename: collect-optional-templates
        './tasks/collect-optional-files',
        //TODO: rename: postprocess-optional-templates
        './tasks/postprocess-optional-files',
        './tasks/expand-filepaths',
        './tasks/get-git-info',
        './tasks/file-processor-manager',
        './tasks/clean-directory',
        './tasks/update-package-dependencies',
        './tasks/save-project-files',
        // './tasks/nvm-version',
        './tasks/npm-install',
        './tasks/open-target-directory',
    ],
    cachePath: '~/.core.io/templates',
};

class Cookiecutter {
    constructor(options) {
        this.init(options);
    }

    init(config) {
        config = extend({}, DEFAULTS, config);
        extend(this, config);

        let middleware = this.middleware.concat();

        this.middleware = [];

        let id;
        middleware.map((middleware, index, arr) => {
            id = middleware;
            if(typeof middleware === 'string') {
                middleware = require(middleware);
            }
            middleware.id = id;
            this.middleware[index] = middleware;
        });
    }

    run(options={}) {

        this.init(options);
        console.log('run', options);

        return this.findTemplate(options).then(()=> {
            //Execute all promises
            let middleware = this.middleware.concat();
            this.logger.info('Total steps %s', middleware.length);

            return new Promise((resolve, reject)=> {
                function step(context) {
                    let next = middleware.shift();
                    if(!next) {
                        context.logger.info('Done!');
                        return resolve(context);
                    }
                    context.logger.info('Step: %s', next.id);

                    var p = next(context);

                    if(!p) {
                        context.logger.warn('Step did not return a Promise %s', next.id);
                        return step(context);
                    }

                    p.then(step).catch((err)=>{
                        context.logger.error('Error on step %s', next.id);
                        context.logger.error(err.message);
                    });
                }
                step(this);
            });
        }).catch((err)=>{
            this.logger.error('Error creating project', err.message);
        });
    }

    findTemplate(options) {
        this.template = new ProjectTemplate(options);

        this.source = this.template.getContentsPath();
        console.log('findTemplate', this.source);
        console.log('template uri', this.template.uri);
        console.log('findTemplate %j', options);

        return this.template.fetch().then((res) => {
            this.logger.info('Fetch template...', res);
            return this;
        });
    }

    findOptionalsPath(optional, item='') {
        let filepath = this.template.getTargetPath();

        filepath = path.join(filepath, 'optional-files', optional, item);

        if(fs.existsSync(filepath)) {
            return filepath;
        }

        return false;
    }

    collectOptionalTemplates(item='') {
        let optionals = [];

        //@TODO: Move to index.js?
        Object.keys(this.optionals).map((optional) => {
            optionals.push(this.findOptionalsPath(optional, item));
        });
        optionals = optionals.filter(Boolean);

        return optionals;
    }

    getPromptPath() {
        let filepath = this.template.getTargetPath();
        filepath = path.join(filepath, this.promptFile);
        return filepath;
    }

    getPackageFile() {
        let packageFile;
        this.files.map((file)=> {
            if(file.src.indexOf('package.json') === -1){
                return;
            }
            packageFile = file;
        });
        return packageFile;
    }

    use(middleware) {
        this.middleware.push(middleware);
        return this;
    }
}

module.exports = Cookiecutter;
