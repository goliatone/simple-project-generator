'use strict';
//@ts-check
const extend = require('gextend');
const BaseCommand = require('./base');
const ProjectTemplate = require('../lib/project-template');
const resolve = require('path').resolve;
const untildify = require('untildify');

class ListTemplatesCommand extends BaseCommand {

    constructor(options = {}) {
        extend(this, options);
    }

    execute(event) {
        event = extend({}, ListTemplatesCommand.DEFAULTS, event);

        let o = event.options;

        o.templates = untildify(o.templates);
        o.templates = event.pathSolver(o.templates);

        let solver = new ProjectTemplate({
            logger: this.logger,
            cachePath: o.templates
        });

        return solver.list(o).then((templates)=>{
            this.logger.info('Templates:');
            this.logger.info(templates);
            this.logger.info();
            return templates;
        });
    }

    static describe(prog, cmd){
        cmd.option('--templates <path>', 
            '<path> to template files', 
            null,
            ListTemplatesCommand.DEFAULTS.options.templates
        );
    }
}

ListTemplatesCommand.DEFAULTS = {
    pathSolver: resolve,
    options: {
        templates: '~/.core.io/templates'
    }
};

ListTemplatesCommand.COMMAND_NAME = 'list';
ListTemplatesCommand.DESCRIPTION = 'List available templates';

module.exports = ListTemplatesCommand;
