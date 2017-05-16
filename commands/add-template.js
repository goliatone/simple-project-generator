'use strict';
const extend = require('gextend');
const ProjectTemplate = require('../lib/project-template');
const resolve = require('path').resolve;

class AddTemplateCommand {

    constructor(options = {}) {
        extend(this, options);
    }

    execute(event) {
        event = extend({}, AddTemplateCommand.DEFAULTS, event);

        event.source = event.pathSolver(event.source);

        let o = event.options;

        o.templates = event.pathSolver(o.templates);

        let solver = new ProjectTemplate({
            uri: event.source,
            alias: event.alias,
            cachePath: event.templates
        });

        return solver.fetch();
    }
}

AddTemplateCommand.DEFAULTS = {
    pathSolver: resolve,
    options: {
        skipCache: false,
        templates: '~/.core.io/templates'
    }
};

module.exports = AddTemplateCommand;
