'use strict';
const extend = require('gextend');
const ProjectTemplate = require('../lib/project-template');
const resolve = require('path').resolve;
const untildify = require('untildify');

class AddTemplateCommand {

    constructor(options = {}) {
        extend(this, options);
    }

    execute(event) {
        event = extend({}, AddTemplateCommand.DEFAULTS, event);

        let o = event.options;

        o.templates = untildify(o.templates);
        o.templates = event.pathSolver(o.templates);

        let solver = new ProjectTemplate({
            logger: this.logger,
            cachePath: o.templates
        });

        return solver.fetch(event.source, {
            alias: event.alias,
            skipCache: o.skipCache
        });
    }
}

AddTemplateCommand.DEFAULTS = {
    pathSolver: resolve,
    options: {
        skipCache: false,
        templates: '~/.core.io/templates'
    }
};

AddTemplateCommand.COMMAND_NAME = 'add';

module.exports = AddTemplateCommand;
