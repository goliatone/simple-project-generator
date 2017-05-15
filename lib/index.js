'use strict';
const path = require('path');
const extend = require('gextend');
// const Promise = require('bluebird');
const ProjectTemplate = require('./project-template');

const DEFAULTS = {
    logger: console,
    //We should be able to specify this in the
    //template project package.json or config.json
    promptFile: 'prompt.js',
    middleware: [
        './tasks/collect-prompt',
        './tasks/collect-files',
        './tasks/expand-filepaths',
        './tasks/get-git-info',
        './tasks/file-processor-manager',
        './tasks/clean-directory',
        './tasks/save-project-files',
    ],
    cachePath: '/tmp/core.io/templates',
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

        middleware.map((middleware, index, arr) => {
            if(typeof middleware === 'string') {
                middleware = require(middleware);
            }
            this.middleware[index] = middleware;
        });
    }

    run(options={}) {

        this.init(options);

        return this.findTemplate(options).then(()=> {
            //Execute all promises
            let middleware = this.middleware.concat();
            this.logger.info('Total steps %s', middleware.length);

            return new Promise((resolve, reject)=>{
                function step(context) {
                    let next = middleware.shift();
                    if(!next) return resolve(context);
                    next(context).then(step);
                }
                step(this);
            });
        });
    }

    findTemplate(options) {
        this.template = new ProjectTemplate(options);

        this.source = this.template.getContentsPath();

        return this.template.fetch().then((res) => {
            this.logger.info('Fetch template...', res);
            return this;
        });
    }

    getPromptPath() {
        let filepath = this.template.getTargetPath();
        filepath = path.join(filepath, this.promptFile);
        return filepath;
    }

    use(middleware) {
        this.middleware.push(middleware);
        return this;
    }
}

module.exports = Cookiecutter;
