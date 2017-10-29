'use strict';

const Add = require('./add');
const New = require('./new');
const Link = require('./link');
const List = require('./list');

module.exports.attach = function(prog, namespace=false) {
    Add.attach(prog, namespace);
    List.attach(prog, namespace);
    New.attach(prog, namespace);
    Link.attach(prog, namespace);
};