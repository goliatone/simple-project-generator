'use strict';
const extend = require('gextend');
const Cookiecutter = require('../lib');
const resolve = require('path').resolve;
const untildify = require('untildify');

class GenerateCommand {

    constructor(options = {}) {
        extend(this, options);
    }

    execute(event) {
        event = extend({}, GenerateCommand.DEFAULTS, event);

        // event.template = event.pathSolver(event.template);
        event.output = event.pathSolver(event.output);

        let o = event.options;

        o.templates = untildify(o.templates);
        o.templates = event.pathSolver(o.templates);
        console.log('templates path', o.templates);

        let solver = new Cookiecutter();

        return solver.run({
            uri: event.template,
            target: event.output,
            // alias: 'base-template',
            dryRun: o.dryRun,
            cachePath: o.templates,
        });
    }
}

GenerateCommand.DEFAULTS = {
    output: './output',
    template: '',
    pathSolver: resolve,
    options: {
        clean: false,
        dryRun: false,
        promptFile: 'prompt.js',
        templates: '~/.core.io/templates'
    }
};

GenerateCommand.COMMAND_NAME = 'new';

module.exports = GenerateCommand;
