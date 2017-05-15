'use strict';
const path = require('path');
const extend = require('gextend');
const Promise = require('bluebird');
const ProjectTemplate = require('./project-template');

const DEFAULTS = {
    logger: console,
    promptFile: 'prompt.js',
    middleware: [
        // './tasks/collect-prompt',
        // './tasks/clean-directory',
        // './tasks/collect-files',
        // './tasks/expand-filepaths',
        // './tasks/get-git-info',
        // './tasks/file-processor-manager',
        // './tasks/save-project-files',
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

        // let middleware = this.middleware.concat();
        //
        // this.middleware = [];
        //
        // middleware.map((middleware, index, arr) => {
        //     if(typeof middleware === 'string') {
        //         middleware = require(middleware);
        //     }
        //     console.log('index', index);
        //     this.middleware[index] = middleware;
        // });
    }

    execute(options={}) {

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

new Cookiecutter()
    .use((context)=> {
        const collectPrompt = require('./tasks/collect-prompt');
        return collectPrompt(context);
    })
    // .use((context)=> {
    //     console.log('config', context.config);
    //     //It has to return a promise!
    //     return Promise.resolve(context);
    // })
    .use((context)=>{
        const collectFiles = require('./tasks/collect-files');
        return collectFiles(context);
    })
    .use((context) => {
        const expandFilepaths = require('./tasks/expand-filepaths');
        return expandFilepaths(context);
    })
    .use((context)=>{
        const getGitInfo = require('./tasks/get-git-info');
        return getGitInfo(context);
    })
    .use((context)=> {
        const processManager = require('./tasks/file-processor-manager');
        return processManager(context);
    })
    .use((context)=> {
        const cleanDir = require('./tasks/clean-directory');
        return cleanDir(context);
    })
    .use((context) => {
        const saveProjectFiles = require('./tasks/save-project-files');
        return saveProjectFiles(context);
    })
    .execute({
        uri: './example',
        dryRun: false,
        alias: 'base-template',
        target: '/tmp/core.io/output/#name#',
        cachePath: '/tmp/core.io/templates',
    })
    .then(()=>console.log('done!'))
    .catch(console.log);
