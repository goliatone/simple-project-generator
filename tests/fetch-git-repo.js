const fetchGitRepo = require('../lib/tasks/fetch-git-repo');

fetchGitRepo('goliatone/gconfig', './test/out')
    .then(console.log)
    .catch(console.error);
