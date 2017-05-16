'use strict';
const extend = require('gextend');
const ProjectTemplate = require('../lib/project-template');
const resolve = require('path').resolve;

class ListTemplatesCommand {

    constructor(options = {}) {
        extend(this, options);
    }

    execute(event) {
        event = extend({}, ListTemplatesCommand.DEFAULTS, event);

        let o = event.options;

        o.templates = event.pathSolver(o.templates);

        let solver = new ProjectTemplate({
            cachePath: o.templates
        });

        return solver.list();
    }
}

ListTemplatesCommand.DEFAULTS = {
    pathSolver: resolve,
    options: {
        templates: '~/.core.io/templates'
    }
};

ListTemplatesCommand.COMMAND_NAME = 'list';

module.exports = ListTemplatesCommand;
