'use strict';

const collectConfiguration = require('../lib/tasks/collect-prompt');

let p = './test/'
collectConfiguration(p, {
    defaults:{
        first_name:'Pepe'
    }}).then(console.log);
