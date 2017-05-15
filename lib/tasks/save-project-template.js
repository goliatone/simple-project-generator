'use strict';

const enfscopy = require('enfscopy-promise').copyP;

function copyDir(source, target) {
    return enfscopy(source, target);
}

module.exports = copyDir;
