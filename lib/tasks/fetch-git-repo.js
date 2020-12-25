'use strict';

const downloadRepo = require('download-git-repo');

/**
 * Fetch a Github `repository` and copy the
 * contents to `target` directory.
 *
 * If `target` directory does not exists, it
 * will be created.
 *
 * If `target` directory does exist and has
 * contents some files might be overwritten.
 *
 * @param  {String} repository   Github repo
 * @param  {String} target Path to output
 * @return {Promise}
 */
function fetchGitRepo(repository, target) {
    // @TODO Normalize API signature to take in only context
    return new Promise((resolve, reject) => {

        downloadRepo(repository, target, (err) => {
            if (err) return reject(err);
            else resolve(target);
        });
    });
}

module.exports = fetchGitRepo;