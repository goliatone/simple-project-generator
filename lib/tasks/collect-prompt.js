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

function collectConfiguration(context, options={}) {
    options = extend({}, DEFAULTS, options);
    let filepath = context.getPromptPath();
    filepath = resolve(filepath);

    return new Promise((resolve, reject) => {
        fileExists(filepath).then(() => {
            let questions = require(filepath);

            ensureDefaults(questions);

            inquirer.prompt(questions).then(function (answers) {
                context.config = ensureDefaults(answers, options.defaults);
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
