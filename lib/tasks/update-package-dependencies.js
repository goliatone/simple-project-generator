'use strict';
const extend = require('gextend');

function updatePakcageDeps(context) {
    //load new project package:
    let packagePath = context.getPackagePath();
    let pkg = new Package(packagePath);
    pkg.load();
    pkg.extend(context.config.dependencies, 'dependencies');

    return pkg.save().then(()=>context);
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

        if(property) {
            content = content[property];
        }

        extend(content, object);
    }

    save(filepath=this.filepath) {
        const fs = require('fs');
        const content = JSON.stringify(this._content, null, 2);

        return new Promise((reject, resolve)=>{
            fs.writeFile(filepath, content, function(err) {
                if(err) reject(err);
                else resolve(this._content);
            });
        });
    }

    find(basedir) {

    }
}
