'use strict';

const fs = require('fs');
const path = require('path');
const rmfr = require('rmfr');
const extend = require('gextend');
const untildify = require('untildify');
const symlink = require('symlink-or-copy').sync;
const fileExists = require('fs-exists-promised');
const mkdirp = require('mkdir-promise');

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

    init(config = {}) {
        let uri = config.uri;

        extend(this, config);

        /*
         * Expand logger to tasks.
         */
        this.options.logger = this.logger;

        /*
         * We want to ensure that the project name
         * is respected...
         */
        if (uri && this.isCached(uri)) {
            this.uri = this.getTargetPath(uri);
        }

        /**
         * Ensure we have cacheDir
         */
        // if(!fs.existsSync(this.cachePath)) {
        //     mkdirp(this.cachePath);
        // }
    }

    /**
     * Main action to fetch a template and copy locally
     * @param  {String} [uri=this.uri]
     * @param  {Object} [options={}]
     * @return {Promise}
     */
    fetch(uri = this.uri, options = {}) {
        options = extend({}, this.options, options);

        //isRepoUri expects a full url. We could check for
        //github like uri where username/template
        this.uri = uri;

        if (options.skipCache) {
            return this.fetchGitRepo(uri, options);
        }

        //TODO: We should retrieve from cache!!
        if (this.isRepoUri && !this.isCached(this.uri)) {
            return this.fetchGitRepo(uri, options);
        }

        return this.fetchLocal(uri, options);
    }

    link(source, options = {}) {
        options = extend({}, this.options, options);

        const target = this.getTargetPath(source, options);

        if (fs.existsSync(target)) {
            this.logger.info('Template already exists');
            if (options.force) {
                this.logger.warn('You are about to force copy over it...');
                return rmfr(target).then(_ => {
                    return this.link(source, options);
                });
            } else {
                this.logger.error('If you want to overwrite it add the --force option.');
                return Promise.reject();
            }
        }
        //ensure we have templates dir
        if (!fs.existsSync(this.cachePath)) {
            return mkdirp(this.cachePath).then(() => {
                return this.link(source, options);
            });
        }

        // console.log('ln -s %s %s', source, target);
        symlink(source, target);

        //need to npm install

        return Promise.resolve();
    }

    list(options = {}) {
        if (!fs.existsSync(this.cachePath)) {
            return mkdirp(this.cachePath).then(() => []);
        }

        options = extend({}, this.options, options);
        /*  
         * TODO: We should generate a desription object.
         * It should be the directory name, 
         * and a find package.json
         */
        let templates = getDirectories(this.cachePath);

        templates = templates.map((tpl) => {
            return tpl + ': ' + require(path.join(this.cachePath, tpl, 'package.json')).description;
        });

        return Promise.resolve(templates);
    }

    fetchGitRepo(uri = this.uri, options = {}) {
        options = extend({}, this.options, options);

        this.uri = uri;

        //create tmp dir
        return tmp(options, {}).then(context => {
            //move git repo to tmp dir
            return fetchGitRepo(uri, context.tempTarget).then(() => {
                //save cache of local
                let target = this.getTargetPath(uri, options);
                options = wrapNpmInstall(target, options);
                return saveProjectTemplate(context.tempTarget, target).then(() => {
                    return installPackages(options).then(() => {
                        return target;
                    });
                });
            });
        });
    }

    getTargetPath(uri = this.uri, options = {}) {
        options = extend({}, this.options, options);

        this.uri = uri;

        let projectName = this.getLocalName(uri, options);
        let filepath = path.join(this.cachePath, projectName);
        if (options.alias || this.alias) {
            filepath = filepath.replace(path.basename(filepath), options.alias || this.alias);
        }
        return filepath;
    }

    getContentsPath(uri = this.uri, options = {}) {
        let target = this.getTargetPath(uri, options);
        return path.join(target, this.contentDirectory);
    }

    fetchLocal(uri = this.uri, options = {}) {
        options = extend({}, this.options, options);
        let target = this.getTargetPath(uri);

        if (uriHelper.isAbsolute(target)) {
            target = this.getTargetPath(uri, options);
            return saveProjectTemplate(uri, target).then(() => {
                return target;
            });
        }

        if (!this.isCached(uri)) {
            return Promise.reject(new Error('Template not found'));
        }

        return Promise.resolve(target);
    }

    isCached(uri = this.uri) {
        let projectName = this.getLocalName(uri);
        let target = path.join(this.cachePath, projectName);
        return fs.existsSync(target);
    }

    getLocalName(uri = this.uri) {
        return uriHelper.getLocalName(uri);
    }

    set uri(v) {
        this._uri = v;
        if (this.isLocalUri) {
            this._uri = path.resolve(v);
        }
    }

    get uri() {
        return this._uri;
    }

    get isRepoUri() {
        let v = this._uri || '';
        console.log('v', v);
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

function wrapNpmInstall(target, options) {
    options.getPackageFile = function() {
        return {
            dest: `${target}/package.json`
        };
    };

    return options;
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => {
            file = fs.lstatSync(path.join(srcpath, file));
            return file.isSymbolicLink() || file.isDirectory();
        });
}

module.exports = ProjectTemplate;