'use strict';
const extend = require('gextend');

function updatePakcageDeps(context) {
    return new Promise(function(resolve, reject) {
        //load new project package:
        let packageFile = context.getPackageFile();

        let pkg = JSON.parse(packageFile.content);
        pkg.dependencies = extend(pkg.dependencies, context.config.dependencies);

        packageFile.content = JSON.stringify(pkg, null, 2);

        resolve(context);
    });
}

module.exports = updatePakcageDeps;

class Package {
    constructor(filepath) {
        this.filepath = filepath;
    }

    load() {
        this._content = require(this.filepath);
    }

    extend(object, property) {
        let content = this._content;

        if (property) {
            content = content[property];
        }

        extend(content, object);
    }

    save(filepath = this.filepath) {
        const fs = require('fs');
        const content = JSON.stringify(this._content, null, 2);

        return new Promise((reject, resolve) => {
            fs.writeFile(filepath, content, function(err) {
                if (err) reject(err);
                else resolve(this._content);
            });
        });
    }

    find(basedir) {

    }
}