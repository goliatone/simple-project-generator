'use strict';
const moment = require('moment');
const KeyPath = require('gkeypath');

function getDateInfo(context = {}) {
    return new Promise((resolve, reject) => {
        if (!context.config) context.config = {};

        const formatDate = function(date = '', format = 'YY-MM-DD HH:MM:ss') {
            return moment(new Date(date)).format(format);
        };

        let date = new Date();

        context.config.date = {
            raw: date,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
        };

        /**
         * Set a new filter `formatDate` that will be
         * available in the template engine at run-time.
         */
        KeyPath.set(context, 'config.template.options.filters', { formatDate });

        resolve(context);
    });

}

module.exports = getDateInfo;

// getGitInfo().then(console.log)