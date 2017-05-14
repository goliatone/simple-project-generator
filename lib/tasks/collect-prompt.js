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

function collectConfiguration(filepath, options={}) {
    options = extend({}, DEFAULTS, options);

    filepath = join(filepath, options.promptFile);
    filepath = resolve(filepath);
    
    return new Promise((resolve, reject) => {
        fileExists(filepath).then(() => {
            let questions = require(filepath);

            ensureDefaults(questions);

            inquirer.prompt(questions).then(function (answers) {
                answers = ensureDefaults(answers, options.defaults);
                resolve(answers);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err) => {
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
