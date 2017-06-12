'use strict';

const figlet = require('figlet'),

function generateBanner(context) {
    let font = context.bannerFont || 'ANSI Shadow';
    let options = {
        font
    };

    return new Promise(function(resolve, reject) {
        figlet(context.name, options, (err, data) => {
            if(err) reject(err);
            else {
                context.bannerText = data;
                resolve(context);
            }
        });
    });
}
