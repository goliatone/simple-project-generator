'use strict';
const fs = require('fs');

function postProcessOptionalTemplates(context) {
    let optionals = context.collectOptionalTemplates('index.js');

    return new Promise(function(resolve, reject) {

        if (!optionals) {
            console.log('Reject optionals');
            return resolve(context);
        }

        optionals.map(index => {
            let optional = require(index);
            if (typeof optional.injectContext === 'function') {
                optional.injectContext(context);
            }
        });

        resolve(context);
    });
}

module.exports = postProcessOptionalTemplates;
