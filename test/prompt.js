'use strict';

module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'What\'s the project\'s name'
    },
    {
        type: 'input',
        name: 'license',
        message: 'What\'s is the license',
        default: function () {
            return 'MIT';
        }
    },
    {
        type: 'input',
        name: 'descripton',
        message: 'Short project descripton'
    }
];
