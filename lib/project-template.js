'use strict';

const path = require('path');
const extend = require('gextend');
const untildify = require('untildify');

const uriHelper = require('./uri-type');
const tmp = require('./tasks/create-tmp-dir');
const fetchGitRepo = require('./tasks/fetch-git-repo');
const saveProjectTemplate = require('./tasks/save-project-template');
const installPackages = require('./tasks/npm-install');

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
        let uri = config.uri;

        extend(this, config);

        /*
         * We want to ensure that the project name
         * is respected...
         */
        if(uri && this.isCached(uri)) {
            this.uri = this.getTargetPath(uri);
        }
    }

    fetch(uri=this.uri, options={}) {
        options = extend({}, this.options, options);

        //isRepoUri expects a full url. We could check for
        //github like uri where username/template
        this.uri = uri;
console.log('fetch:uri', this.uri);

        if(options.skipCache) {
            return this.fetchGitRepo(uri, options);
        }
        if(this.isRepoUri && !this.isCached(this.uri)) {
            console.log('fetch repo', this.uri);
            return this.fetchGitRepo(uri, options);
        }

        return this.fetchLocal(uri, options);
    }

    fetchGitRepo(uri=this.uri, options={}) {
        options = extend({}, this.options, options);

        this.uri = uri;

        //create tmp dir
        return tmp(options, {}).then((context) => {
            //move git repo to tmp dir
            return fetchGitRepo(uri, context.tempTarget).then(() => {
                //save cache of local
                let target = options.target = this.getTargetPath(uri, options);
                return saveProjectTemplate(context.tempTarget, target).then(() => {
                    return installPackages(options).then(()=>{
                        return target;
                    });
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
        console.log('fetchLocal: %s', uri, target);

        if(uriHelper.isAbsolute(target)) {
            target = this.getTargetPath(uri, options);
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
        console.log('projectName', projectName);
        let target = path.join(this.cachePath, projectName);
        var fs = require('fs');
        return fs.existsSync(target);
    }

    getLocalName(uri=this.uri) {
        return uriHelper.getLocalName(uri);
    }

    set uri(v) {
        console.log('seturi', v);
        this._uri = v;
        if(this.isLocalUri) {
            this._uri = path.resolve(v);
        }
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
        return (!uriHelper.isGithubRepo(v) &&
            (uriHelper.isRelative(v) ||
            uriHelper.isAbsolute(v))
        );
    }

    set cachePath(v) {
        this._cachePath = untildify(v);
    }

    get cachePath() {
        return this._cachePath;
    }
}

module.exports = ProjectTemplate;
