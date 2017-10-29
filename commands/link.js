'use strict';
//@ts-check

const BaseCommand = require('./base');
const ProjectTemplate = require('../lib/project-template');
const AddTemplateCommand = require('./add-template');

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
            alias: event.alias
        });
    }

    static describe(prog, cmd){

        cmd.argument('[source]', 
            'Path to local directory containing the template',
            /.*/, 
            AddTemplateCommand.DEFAULTS.source
        );

        cmd.argument('[alias]', 
            'Save template with [alias].', 
            /.*/
        );

        cmd.option('--templates <path>', 
            '<path> to template files', 
            null,
            LinkTemplateCommand.DEFAULTS.options.templates
        );

        cmd.option('--force', 
            'If destination template exists overwrite it', 
            null,
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
