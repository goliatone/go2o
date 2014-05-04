/*
 * go2o
 * https://github.com/goliatone/go2o
 * Created with gbase.
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
/* jshint strict: false, plusplus: true */
/*global define: false, require: false, module: false, exports: false */
(function (root, name, deps, factory) {
    "use strict";
    // Node
     if(typeof deps === 'function') {
        factory = deps;
        deps = [];
    }

    if (typeof exports === 'object') {
        module.exports = factory.apply(root, deps.map(require));
    } else if (typeof define === 'function' && 'amd' in define) {
        //require js, here we assume the file is named as the lower
        //case module name.
        define(name.toLowerCase(), deps, factory);
    } else {
        // Browser
        var d, i = 0, global = root, old = global[name], mod;
        while((d = deps[i]) !== undefined) deps[i++] = root[d];
        global[name] = mod = factory.apply(global, deps);
        //Export no 'conflict module', aliases the module.
        mod.noConflict = function(){
            global[name] = old;
            return mod;
        };
    }
}(this, "go2o", function() {

    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         meging target to params.
     */
    var _extend= function extend(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var property in source) {
                if(source[property] && source[property].constructor &&
                    source[property].constructor === Object){
                    target[property] = target[property] || {};
                    target[property] = extend(target[property], source[property]);
                } else target[property] = source[property];
            }
        });
        return target;
    };

    /**
     * Shim console, make sure that if no console
     * available calls do not generate errors.
     * @return {Object} Console shim.
     */
    var _shimConsole = function(){
        var empty = {},
            con   = {},
            noop  = function() {},
            properties = 'memory'.split(','),
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                       'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
                       'table,time,timeEnd,timeStamp,trace,warn').split(','),
            prop,
            method;

        while (method = methods.pop())    con[method] = noop;
        while (prop   = properties.pop()) con[prop]   = empty;

        return con;
    };

    var _diff = function(src, tgt){
        var keys = Object.keys(tgt);
        return Object.keys(src).filter(function(i){
            return keys.indexOf(i) < 0;
        });
    };

///////////////////////////////////////////////////
// CONSTRUCTOR
///////////////////////////////////////////////////

	var options = {

    };

    /**
     * Go2o constructor
     *
     * @param  {object} config Configuration object.
     */
    var Go2o = function(config){
        //TODO: We want to only merge in valid attributes!!
        //not the whole config object!
        config  = config || {};
        config = _extend({}, this.constructor.DEFAULTS, config);

        this.init(config);
    };

    /**
     * Make default options available so we
     * can override.
     */
    Go2o.DEFAULTS = options;

///////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////

    Go2o.prototype.init = function(config){
        if(this.initialized) return this.logger.warn('Already initialized');
        this.initialized = true;

        console.log('Go2o: Init!', config);

        _extend(this, config);
        //If we do not have schema, then WTF?
        this.schema || (this.schema = {});

        this.matchers = {};
        this.transformers = {};
        this.processors = {};

        this.postprocessors = {};

        this.handledKeys = {};

        this.typeMap = {
            'String' : 'transformers',
            'RegExp' : 'matchers',
            'Function': 'processors'
        };

        this.addTransformer('rename', function(path, name){
            console.log('=> rename %s to %s', path, name);
            this.output[name] = this.source[path];
            return true;
        });

        this.addTransformer('collapse', function(path, name){
            console.log('=> collapse %s to %s', path, name);
            if(! this.output.hasOwnProperty(name)) this.output[name] = [];
            this.output[name].push(this.source[path]);
            return true;
        });

        /*this.addTransformer(/address[1-9]/, function(path, collapse){
            console.info('=> matching %s with %s', path, collapse);

        });*/

        this.addPostprocessor('mergeOrphans', function(){
            var orphans = _diff(this.source, this.handledKeys);
            orphans.forEach(function(key){
                this.output[key] = this.source[key];
            }, this);
        });
    };

    Go2o.prototype.run = function(data){
        console.log('parsing',data);
        this.source = _extend({}, data);
        //For now we assume we want an Object as output
        //but we might want to go from Array to Object or from
        //Object to Array. That would be a transform in the 'root'
        this.output = {};

        //Iterate over the source properties in schema:
        Object.keys(this.schema).forEach(function(path){
            this.applyTransformTo(path);
        }, this);

        //after we run all trasforms, we should pic all properties of
        //original object and append those to the output.
        this.runPost();

        return this.output;
    };

    Go2o.prototype.applyTransformTo = function(path){
        var rules = this.schema[path],
            arg   = null,
            handled = false;

        //for now we assume that all schema values are objs.
        Object.keys(rules).forEach(function(event){
            arg = rules[event];

            if(this.transformers.hasOwnProperty(event)){
                handled = this.transformers[event].call(this, path, arg);
                if(handled === true) this.handledKeys[path] = true;
            }

            //TODO: We can inline this in run, collect all matchers.
            /*var regexp;
            Object.keys(this.matchers).forEach(function(matcher){
                //TODO: Clean up...we should be storing objects id => matcher.
                regexp = new RegExp(matcher.replace('/','').replace('/',''));

                if( ! path.match(regexp)) return;

                handled = this.matchers[matcher].call(this, path, arg);

                if(handled === true) this.handledKeys[path] = true;
            }, this);*/

        }, this);
    };

    Go2o.prototype.addTransformer = function(event, transformer){
        var eventType = event.constructor.name; // this, fails in <IE9, shim
        var holder = this.typeMap[eventType];
        this[holder][event] = transformer;

        //WE REALLY WANT TO DO THIS WITH EVENTS!!
        // this.on(transformer.key, transformer.execute);
    };

    Go2o.prototype.addPostprocessor = function(id, post){
        this.postprocessors[id] = post;
    };

    Go2o.prototype.runPost = function(){
        Object.keys(this.postprocessors).forEach(function(id){
            this.postprocessors[id].call(this);
        }, this);
    };

    /**
     * Logger method, meant to be implemented by
     * mixin. As a placeholder, we use console if available
     * or a shim if not present.
     */
    Go2o.prototype.logger = console || _shimConsole();

    return Go2o;
}));