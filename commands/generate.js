'use strict';
const extend = require('gextend');
const Cookiecutter = require('../lib');
const resolve = require('path').resolve;

class GenerateCommand {

    constructor(options = {}) {
        extend(this, options);
    }

    execute(event) {
        event = extend({}, GenerateCommand.DEFAULTS, event);

        event.source = event.pathSolver(event.source);
        event.output = event.pathSolver(event.output);

        let o = event.options;

        o.templates = event.pathSolver(o.templates);

        let solver = new Cookiecutter();

        return solver.run({
            uri: event.source,
            target: event.output,
            // alias: 'base-template',
            dryRun: o.dryRun,
            cachePath: o.templates,
        });
    }
}

GenerateCommand.DEFAULTS = {
    output: './output',
    source: '',
    pathSolver: resolve,
    options: {
        clean: false,
        dryRun: false,
        promptFile: 'prompt.js',
        templates: '~/.core.io/templates'
    }
};

module.exports = GenerateCommand;
