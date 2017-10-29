'use strict';

const Add = require('./add-template');
const Generate = require('./generate');
const Link = require('./link-template');
const List = require('./list-templates');

module.exports.attach = function(prog, namespace=false) {
    Add.attach(prog, namespace);
    List.attach(prog, namespace);
    Generate.attach(prog, namespace);
    Link.attach(prog, namespace);
};