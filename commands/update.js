'use strict';

const extend = require('gextend');
const BaseCommand = require('base-cli-commands').BaseCommand;

const ProjectTemplate = require('../lib/project-template');
const resolve = require('path').resolve;
const untildify = require('untildify');

class UpdateTemplateCommand extends BaseCommand {

    execute(event) {
        event = extend({}, UpdateTemplateCommand.DEFAULTS, event);

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
        }).then(_ => {
            this.logger.info('√ Template successfully added');
        });
    }

    static describe(prog, cmd) {
        cmd.argument('<source>',
            'Uri to template stored in github; username/project-name',
            /.*/
        );

        cmd.option('--skip-cache',
            'Force download template even if its cached.',
            prog.BOOL,
            UpdateTemplateCommand.DEFAULTS.options.skipCache
        );

        cmd.option('--templates <path>',
            '<path> to template files',
            null,
            UpdateTemplateCommand.DEFAULTS.options.templates
        );
    }
}

UpdateTemplateCommand.DEFAULTS = {
    pathSolver: resolve,
    options: {
        skipCache: false,
        templates: '~/.core.io/templates'
    }
};

UpdateTemplateCommand.COMMAND_NAME = 'update';
UpdateTemplateCommand.DESCRIPTION = 'Update a project template';

module.exports = UpdateTemplateCommand;