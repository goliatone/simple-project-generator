'use strict';

const ProjectTemplate = require('../lib/project-template');

let template = new ProjectTemplate({
    cachePath: '/tmp/core.io/templates',
});

template.fetch('goliatone/gextend')
    .then(console.log)
    .catch(console.log);
