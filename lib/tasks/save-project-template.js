'use strict';

const enfscopy = require('enfscopy-promise').copyP;

//@TODO: Normalize API
function copyDir(source, target, options) {
    return enfscopy(source, target, options);
}

module.exports = copyDir;
