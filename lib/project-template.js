'use strict';

const path = require('path');
const extend = require('gextend');
const untildify = require('untildify');

const uriHelper = require('./uri-type');
const tmp = require('./tasks/create-tmp-dir');
const fetchGitRepo = require('./tasks/fetch-git-repo');
const saveProjectTemplate = require('./tasks/save-project-template');

const DEFUALTS = {
    cachePath: '~/.core.io/templates',
    contentDirectory: 'templates',
    options: {
        skipCache: false
    }
};

class ProjectTemplate {

    constructor(config) {
        config = extend({}, DEFUALTS, config);
        this.init(config);
    }

    init(config={}) {
        extend(this, config);
    }

    fetch(uri=this.uri, options={}) {
        options = extend({}, this.options, options);

        this.uri = uri;

        if(options.skipCache) {
            return this.fetchGitRepo(uri, options);
        }
        if(this.isRepoUri && !this.isCached(this.uri)) {
            return this.fetchGitRepo(uri, options);
        }

        return this.fetchLocal(uri, options);
    }

    fetchGitRepo(uri=this.uri, options={}) {
        options = extend({}, this.options, options);

        this.uri = uri;

        console.log('fetchLocal', uri);
        //create tmp dir
        return tmp().then((dirpath) => {
            console.log('dirpath', dirpath);
            //move git repo to tmp dir
            return fetchGitRepo(uri, dirpath).then(() => {
                //save cache of local
                let target = this.getTargetPath(uri);
                console.log('target', target);
                return saveProjectTemplate(dirpath, target).then(() => {
                    return target;
                });
            });
        });
    }

    getTargetPath(uri=this.uri, options={}) {
        options = extend({}, this.options, options);

        this.uri = uri;

        let projectName = this.getLocalName(uri, options);
        let filepath = path.join(this.cachePath, projectName);
        if(options.alias || this.alias) {
            filepath = filepath.replace(path.basename(filepath), options.alias || this.alias);
        }
        return filepath;
    }

    getContentsPath(uri=this.uri, options={}){
        let target = this.getTargetPath(uri, options);
        return path.join(target, this.contentDirectory);
    }

    fetchLocal(uri=this.uri, options={}) {
        options = extend({}, this.options, options);

        let target = this.getTargetPath(uri);

        if(uriHelper.isAbsolute(uri)) {
            let target = this.getTargetPath(uri, options);
            console.log('target', target);
            return saveProjectTemplate(uri, target).then(() => {
                return target;
            });
        }

        if(!this.isCached(uri)) {
            return Promise.reject(new Error('Template not found'));
        }

        console.log('fetchLocal', target);
        return Promise.resolve(target);
    }

    isCached(uri=this.uri) {
        let projectName = this.getLocalName(uri);
        let target = path.join(this.cachePath, projectName);
        var fs = require('fs');
        return fs.existsSync(target);
    }

    getLocalName(uri=this.uri) {
        return uriHelper.getLocalName(uri);
    }

    set uri(v) {
        this._uri = v;
    }

    get uri() {
        return this._uri;
    }

    get isRepoUri() {
        let v = this._uri || '';
        return uriHelper.isGithubRepo(v);
    }

    get isLocalUri() {
        let v = this._uri || '';
        return Boolean(v.split('/').length === 2);
    }

    set cachePath(v) {
        this._cachePath = untildify(v);
    }

    get cachePath() {
        return this._cachePath;
    }
}

module.exports = ProjectTemplate;

let template = new ProjectTemplate({
    uri: '/Users/eburgos/Development/NODEJS/simple-project-generator/test',
    alias: 'base-template',
    cachePath: '/tmp/core.io/templates',
});
console.log('isRepoUri', template.isRepoUri);
console.log('cached', template.isCached('/Users/eburgos/Development/NODEJS/simple-project-generator/test'));

//Pass context around!
template.fetch()
    .then((template)=> {
        const collectPrompt = require('./tasks/collect-prompt');
        return collectPrompt(template);
    })
    .then((config)=> {
        console.log('config', config);
        return config;
    })
    .then((config)=>{
        const cleanDir = require('./tasks/clean-directory');
        template.context = config;
        return cleanDir('/tmp/' + config.name);
    })
    .then((target)=>{
        const collectFiles = require('./tasks/collect-files');
        return collectFiles(template.getContentsPath(), target);
    })
    .then((meta) => {
        console.log('files', meta.files);
        console.log('-');
        const expandFilepaths = require('./tasks/expand-filepaths');
        return expandFilepaths(meta, template.context);
    })
    .then((context)=> {
        console.log('files', context.files);
        console.log('-');
        const processManager = require('./tasks/file-processor-manager');
        return processManager(context, {
            context: template.context
        });
    })
    .then((files)=>{
        const saveProjectFiles = require('./tasks/save-project-files');
        return saveProjectFiles(files);
    })
    .then(()=>console.log('done!'))
    .catch(console.log);
