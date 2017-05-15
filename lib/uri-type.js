'use strict';
const URL = require('url');

module.exports.isGithubRepo = function(uri) {
    if(this.isUrl(uri)) {
        let url = URL.parse(uri);
        if(url.host !== 'github.com') {
            return false;
        }
        uri = url.path.replace(/^\//,'').replace(/\/$/, '');
    }
    return uri.split('/').length === 2;
};

module.exports.getLocalName = function(uri) {
    if(this.isGithubRepo(uri)) {
        let url = URL.parse(uri);
        uri = url.path;
    }

    uri = uri.replace(/^\//,'').replace(/\/$/, '');
    return uri.split('/').reverse()[0]
};

/**
 * Wether `uri` is a valid github path
 * absolute or relative.
 * @method isGithub
 * @param  {String} uri
 * @return {Boolean}
 */
module.exports.isDomain = function(uri, domain) {
    let self = module.exports;
    if(!self.isUrl(uri)) return false;
    let url = URL.parse(uri);
    return url.host === domain;
};

/**
 * Is valid url
 * @method isUrl
 * @param  {String} [uri='']
 * @return {Boolean}
 */
module.exports.isUrl = function(uri='') {
    return /^(?:\w+:)?\/\//.test(uri);
};

module.exports.isAbsolute = function(uri='') {
    return uri
        && (/^\//.test(uri))        // unix
        || (!!~uri.indexOf(':\\'))  // windows
        || (/^\\\\/.test(uri));     // windows
};

module.exports.isRelative = function(uri) {
    let self = module.exports;
    if (self.isUrl(uri)) return false;
    if (self.isAbsolute(uri)) return false;
    if (/^\.+\//.test(uri)) return true;
    return true;
};

// with(module.exports) {
//     console.log(isGithubRepo('gol'));
// }
