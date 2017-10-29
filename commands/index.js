'use strict';

const Add = require('./add');
const New = require('./new');
const Link = require('./link');
const List = require('./list');

/**
 * Attach commands to given application context,
 * if a `namespace` is given then commands will 
 * be added as sub-commands.
 */
module.exports.attach = function $attach(app, namespace=false) {
    
    const context = {
        namespace,
        prog: app.prog
    };

    Add.attach(context);
    List.attach(context);
    New.attach(context);
    Link.attach(context);
};