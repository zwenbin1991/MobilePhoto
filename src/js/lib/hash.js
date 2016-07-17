/**
 * @description hash
 * @author 曾文彬
 * @date 2016.7.15
 */

'use strict';

const defaultOption = {
    splitter: '!',
    defaultPage: 'index',
    hashChangeWillHandler: function (method, args, context) {}
};

const extend = (target, source, deep) => {
    let value;
    Object.keys(source).forEach(key => {
        value = source[key];

        if (deep && typeof value === 'object') {
            target[key] = {};
            extend(target[key], value, deep);
        } else if (value !== void 0) {
            target[key] = value;
        }
    });

    return target;
};

function Hash (option) {
    this.option = this.constructor.extend({}, defaultOption, option);
}

Hash.prototype._bindEvents = function () {
    window.addEventListener('hashchange', this._hashChangeListener.bind(this), false);
};

Hash.prototype._hashChangeListener = function () {
    const hash = decodeURIComponent(location.hash);
    const hashs = hash.split('/');
    let splitterIndex, moduleName, methodName, params, module, method;

    splitterIndex = hash.indexOf(this.option.splitter);
    splitterIndex < 0 && (splitterIndex = 0);
    moduleName = hashs.shift();
    moduleName && (moduleName = moduleName.slice(1 + (splitterIndex ? this.option.splitter.length : 0)));
    methodName = hashs.shift() || 'init';
    params = hashs;
    module = this.hashObject[moduleName];
    method = module && module[methodName];

    module && method && method.apply(module, params);
};

Hash.prototype.reg = function (moduleName, module) {
    module.hashChangeWillHandler = this.option.hashChangeWillHandler;
    (this.hashObject || (this.hashObject = {}))[moduleName] = module;

    return this;
};

Hash.prototype.run = function () {
    this._bindEvents();

    if (location.hash.indexOf('#') < 0)
        this.forward('#' + this.option.splitter + this.option.defaultPage);
};

Hash.prototype.forward = function (hash) {
    location.hash = hash;
};

Hash.extend = (target, ...sources) => {
    let deep = false;

    if (typeof target === 'boolean') {
        deep = target;
        target = sources.shift();
    }

    sources.forEach(source => {
        extend(target, source, deep);
    });

    return target;
};

export default Hash;