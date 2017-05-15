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

let template = new ProjectTemplate({
    uri: 'goliatone/gextend',
    cachePath: '/tmp/core.io/templates',
});
console.log('isRepoUri', template.isRepoUri);
console.log('cached', template.isCached('goliatone/gextend'));

template.fetch('base-template')
    .then((template)=>{
        //we have a path to a project template
    })
    .catch(console.log);
