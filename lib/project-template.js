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
