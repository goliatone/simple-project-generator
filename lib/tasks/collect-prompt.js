'use strict';
const extend = require('gextend');
const inquirer = require('inquirer');
const fileExists = require('fs-exists-promised');
const join = require('path').join;
const resolve = require('path').resolve;

const DEFAULTS = {
    promptFile: 'prompt.js',
    defaults: {}
};


//make inquirer-npm-name: https://github.com/SBoudrias/inquirer-npm-name
//make inquirer-github-repo: https://github.com/alferov/inquirer-repo-exists
inquirer.registerPrompt('directory', require('inquirer-directory'));
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('orderedcheckbox', require('inquirer-orderedcheckbox'));

function collectConfiguration(context, options={}) {
    options = extend({}, DEFAULTS, options);
    let filepath = context.getPromptPath();

    filepath = resolve(filepath);

    return new Promise((resolve, reject) => {

        fileExists(filepath).then(() => {
            let questions = require(filepath);

            ensureDefaults(questions);

            inquirer.prompt(questions).then(function (answers) {

                if(questions.postprocess) {
                    //You can update
                    answers = questions.postprocess(context, answers);
                }

                if(questions.injectContext) {
                    //You can modify the context from the prompt file
                    answers = questions.injectContext(context, answers);
                }

                context.config = ensureDefaults(answers, options.defaults);

                // if(context.saveConfig) {
                    // console.log(JSON.stringify(context.config, null, 4));
                    // process.exit(0);
                // }

                resolve(context);
            }).catch((err)=> {
                err.context = context;
                reject(err);
            });
        }).catch((err) => {
            err.context = context;
            reject(err);
        });
    });
}

const itr = require('../object-iterator');
function ensureDefaults(answers={}, defaults={}) {
    itr(answers, (value, key) => {
        if(value === '' && defaults[key]) {
            answers[key] = defaults[key];
        }
    });
    return answers;
}

module.exports = collectConfiguration;
