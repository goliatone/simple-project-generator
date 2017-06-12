'use strict';
const extend = require('gextend');
const ProjectTemplate = require('../lib/project-template');
const resolve = require('path').resolve;
const untildify = require('untildify');

class LinkTemplateCommand {

    constructor(options = {}) {
        extend(this, options);
    }

    execute(event) {
        event = extend({}, LinkTemplateCommand.DEFAULTS, event);

        let o = event.options;

        o.templates = untildify(o.templates);
        o.templates = event.pathSolver(o.templates);

        event.source = untildify(event.source);
        event.source = event.pathSolver(event.source);

        let solver = new ProjectTemplate({
            logger: this.logger,
            cachePath: o.templates
        });

        return solver.link(event.source, {
            alias: event.alias
        });
    }
}

LinkTemplateCommand.DEFAULTS = {
    pathSolver: resolve,
    options: {
        force: false,
        templates: '~/.core.io/templates'
    }
};

LinkTemplateCommand.COMMAND_NAME = 'link';

module.exports = LinkTemplateCommand;
