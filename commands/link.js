'use strict';
//@ts-check

const BaseCommand = require('base-cli-commands').BaseCommand;
const ProjectTemplate = require('../lib/project-template');

const extend = require('gextend');
const resolve = require('path').resolve;
const untildify = require('untildify');

class LinkTemplateCommand extends BaseCommand {

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
            alias: event.alias,
            force: !!o.force
        });
    }

    static describe(prog, cmd) {

        cmd.argument('<source>',
            'Path to local directory containing the template',
            /.*/
        );

        cmd.argument('[alias]',
            'Save template with [alias].',
            /.*/
        );

        cmd.option('--templates <path>',
            '<path> to template files',
            prog.STRING,
            LinkTemplateCommand.DEFAULTS.options.templates
        );

        cmd.option('--force',
            'If destination template exists overwrite it',
            prog.BOOL,
            LinkTemplateCommand.DEFAULTS.options.force
        );
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
LinkTemplateCommand.DESCRIPTION = 'Link local template for development';

module.exports = LinkTemplateCommand;
