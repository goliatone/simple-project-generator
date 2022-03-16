'use strict';

const enfsCopy = require('enfscopy-promise').copyP;

//@TODO: Normalize API
function copyDir(source, target, options) {
    return enfsCopy(source, target, options);
}

module.exports = copyDir;
