'use strict';

const enfscopy = require('enfscopy-promise').copyP;

//@TODO: Normalize API
function copyDir(source, target) {
    return enfscopy(source, target);
}

module.exports = copyDir;
