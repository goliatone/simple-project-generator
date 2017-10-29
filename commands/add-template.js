'use strict';

const extend = require('gextend');
const BaseCommand = require('./base');
const ProjectTemplate = require('../lib/project-template');
const resolve = require('path').resolve;
const untildify = require('untildify');

class AddTemplateCommand extends BaseCommand {

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

    static describe(prog, cmd){
        cmd.argument('[source]',
            'Uri to template stored in github; username/project-name',
            /.*/, 
            AddTemplateCommand.DEFAULTS.source
        );
        
        cmd.argument('[alias]', 'Save template with [alias].', /.*/);

        cmd.option('--skip-cache', 
            'Force download template even if its cached.', 
            prog.BOOL, 
            AddTemplateCommand.DEFAULTS.options.skipCache
        );

        cmd.option('--templates <path>', 
            '<path> to template files', 
            null,
            AddTemplateCommand.DEFAULTS.options.templates
        );
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
AddTemplateCommand.DESCRIPTION = 'Add a project template from github or a local directory';

module.exports = AddTemplateCommand;
