const clean = require('../lib/tasks/clean-directory');

clean('./test/out/').then(console.log).catch(console.error);
