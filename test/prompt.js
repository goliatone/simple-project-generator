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
            return 'Doe';
        }
    },
    {
        type: 'input',
        name: 'phone',
        message: 'What\'s your phone number',
        // validate: function (value) {
        //     var pass = value.match(/^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
        //     if (pass) {
        //         return true;
        //     }
        //     return 'Please enter a valid phone number';
        // }
    }
];
