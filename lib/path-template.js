'use strict';

var extend = require('gextend');

var DEFAULTS = {
    openTag: '${',
    closeTag: '}'
};

function Template(config){
    config = extend({}, DEFAULTS, config);
    if(!(this instanceof Template)) return new Template(config);

    extend(this, config);
}

Template.DEFAULTS = DEFAULTS;


Template.prototype.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

Template.prototype.resolvePropertyChain = function(target, path, defaultValue) {
    if (!target || !path) return defaultValue;
    path = path.split('.');
    var l = path.length,
        i = 0,
        p = '';
    for (; i < l; ++i) {
        p = path[i];
        if (target.hasOwnProperty(p)) target = target[p];
        else return defaultValue;
    }
    return target;
};

Template.prototype.compile = function (template, context, openTag, closeTag) {
    if (!template) return '';
    if (!context) return template;

    openTag = (openTag || this.openTag), closeTag = (closeTag || this.closeTag);

    template = template.split('.').join('\\.');
    var self = this;
    function replaceTokens() {
        var prop = arguments[1];
        prop = prop.replace(/\\/g, '');
        return self.resolvePropertyChain(context, prop, openTag + prop + closeTag);
    }

    return template.replace(this.rxp, replaceTokens)
                   .replace(/\\\#/g, '#')
                   .replace(/\\\{/g, '{')
                   .replace(/\\\}/g, '}')
                   .replace(/\\\(/g, '(')
                   .replace(/\\\)/g, ')')
                   .replace(/\\\$/g, '$')
                   .replace(/\\./g, '.');
};

Template.prototype.needsInterpolation = function (key, openTag, closeTag) {
    openTag = openTag || this.openTag, closeTag = closeTag || this.closeTag;
    if (!key || typeof key !== 'string') return false;
    return !!key.match(this.rxp);
};


////////////////////////////////////////
/// GETTERS & SETTERS
////////////////////////////////////////
Object.defineProperty(Template.prototype, 'rxp', {
    get : function(){
        var exp = this.openTag + '([^' + this.closeTag + '\\r\\n]*)' + this.closeTag;
        return new RegExp(exp, 'g');
    },
    enumerable : true
});

Object.defineProperty(Template.prototype, 'openTag', {
    set : function(tag) {
        this._openTag = this.escape(tag);
    },
    get: function(){
        return this._openTag;
    },
    enumerable : true
});

Object.defineProperty(Template.prototype, 'closeTag', {
    set : function(tag){
        this._closeTag = this.escape(tag);
    },
    get: function(){
        return this._closeTag;
    },
    enumerable : true
});


module.exports = Template;
