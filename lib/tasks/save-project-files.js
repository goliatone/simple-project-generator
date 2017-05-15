'use strict';


function saveProjectFiles(context) {
    let promises = context.files.map((file) => {
        return writeFile(file);
    });
}

module.exports = saveProjectFiles;

function writeFile(file) {
    return new Promise((resolve, reject)=>{
        require('fs').writeFile(file.dest, file.content, 'utf-8', (err)=>{
            if(err) reject(err);
            else resolve(file);
        });
    });
}
