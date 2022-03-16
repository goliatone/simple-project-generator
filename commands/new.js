'use strict';
//@ts-check

const BaseCommand = require('base-cli-commands').BaseCommand;

const extend = require('gextend');
const CookieCutter = require('../lib');
const resolve = require('path').resolve;
const untildify = require('untildify');

class GenerateCommand extends BaseCommand {

    execute(event) {
        event = extend({}, GenerateCommand.DEFAULTS, event);

        // event.template = event.pathSolver(event.template);
        event.output = event.pathSolver(event.output);

        let o = event.options;

        o.templates = untildify(o.templates);
        o.templates = event.pathSolver(o.templates);
        console.log('templates path', o.templates);

        let solver = new CookieCutter();

        return solver.run({
            uri: event.template,
            target: event.output,
            // alias: 'base-template',
            dryRun: o.dryRun,
            force: o.force,
            npmCache: o.npmCache,
            cachePath: o.templates,
        });
    }

    static describe(prog, cmd) {

        cmd.argument('<template>',
            'Template name, local or repository',
            /.*/,
            GenerateCommand.DEFAULTS.source
        );

        cmd.argument('[output]',
            'Filename for output.',
            /.*/,
            GenerateCommand.DEFAULTS.output
        );

        cmd.option('--clean',
            'Should the contents of [source] be removed before running',
            prog.BOOL,
            GenerateCommand.DEFAULTS.options.clean
        );

        cmd.option('--prompt-file',
            'Prompt file for this project',
            prog.BOOL,
            GenerateCommand.DEFAULTS.options.saveGuiSchema);

        cmd.option('--dry-run',
            'Prompt file for this project',
            prog.BOOL,
            GenerateCommand.DEFAULTS.options.saveGuiSchema
        );

        cmd.option('--templates <path>',
            '<path> to template files',
            null,
            GenerateCommand.DEFAULTS.options.templates
        );

        cmd.option('--npm-cache',
            'Make a copy of the node_modules in the cache, if available symlink it',
            prog.BOOL,
            GenerateCommand.DEFAULTS.options.npmCache
        );

        cmd.option('--force',
            'If destination template exists overwrite it',
            prog.BOOL,
            GenerateCommand.DEFAULTS.options.force
        );
    }
}

GenerateCommand.DEFAULTS = {
    output: './output',
    template: '',
    pathSolver: resolve,
    options: {
        clean: false,
        force: false,
        dryRun: false,
        npmCache: false,
        promptFile: 'prompt.js',
        templates: '~/.core.io/templates'
    }
};

GenerateCommand.COMMAND_NAME = 'new';
GenerateCommand.DESCRIPTION = 'Create a new project from a project template';

module.exports = GenerateCommand;
