'use strict';


class Cookiecutter {
    constructor(options) {

    }

    init(config) {

    }

    /**
     * Given the template name, find it
     * in the local cache, or if is a valid
     * github repository name, get it.
     * @param  {String} template
     * @return {Promise}
     */
    findTemplate(template) {

    }

    copy(template) {

    }
}

const ProjectTemplate = require('./project-template');

function start(context) {
    let template = new ProjectTemplate({
        uri: '/Users/eburgos/Development/NODEJS/simple-project-generator/test',
        alias: 'base-template',
        cachePath: '/tmp/core.io/templates',
    });

    context.template = template;

    context.source = context.template.getContentsPath();

    context.getPromptPath = function(){
        const path = require('path');
        let filepath = this.template.getTargetPath();
        filepath = path.join(filepath, context.promptFile);
        return filepath;
    };

    return template.fetch().then((res)=>{
        console.log('result', res);
        return context;
    });
}

start({
    promptFile: 'prompt.js',
    errors:[],
    logger: console
})
.then((context)=> {
    const collectPrompt = require('./tasks/collect-prompt');
    return collectPrompt(context);
})
.then((context)=> {
    console.log('config', context.config);
    return context;
})
.then((context)=> {
    const cleanDir = require('./tasks/clean-directory');
    context.target = '/tmp/' + context.config.name;
    return cleanDir(context);
})
.then((context)=>{
    const collectFiles = require('./tasks/collect-files');
    return collectFiles(context);
})
.then((context) => {
    console.log('files', context.files);
    console.log('-');
    const expandFilepaths = require('./tasks/expand-filepaths');
    return expandFilepaths(context);
})
.then((context)=>{
    const getGitInfo = require('./tasks/get-git-info');
    return getGitInfo(context);
})
.then((context)=> {
    console.log('files', context.files);
    console.log('-', context);
    const processManager = require('./tasks/file-processor-manager');
    return processManager(context, {
        context: context.config
    });
})
.then((context) => {
    const saveProjectFiles = require('./tasks/save-project-files');
    return saveProjectFiles(context);
})
.then(()=>console.log('done!'))
.catch(console.log);
