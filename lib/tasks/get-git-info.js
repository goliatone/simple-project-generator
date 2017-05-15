'use strict';

const gitInfo = require('../get-git-config');

function getGitInfo(context={}) {
    return new Promise((resolve, reject)=>{
        gitInfo((err, config)=>{
            if(err) return reject(err);

            if(!context.config){
                context.config = {};
            }

            context.config.git = config;
            resolve(context);
        });
    });

}

module.exports = getGitInfo;
