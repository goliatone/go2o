/*
 * go2o
 * https://github.com/goliatone/go2o
 * Created with gbase.
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
/* jshint strict: false, plusplus: true */
/*global define: false, require: false, module: false, exports: false */
(function(root, name, deps, factory) {
    "use strict";
    // Node
    if (typeof deps === 'function') {
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
        var d, i = 0,
            global = root,
            old = global[name],
            mod;
        while ((d = deps[i]) !== undefined) deps[i++] = root[d];
        global[name] = mod = factory.apply(global, deps);
        //Export no 'conflict module', aliases the module.
        mod.noConflict = function() {
            global[name] = old;
            return mod;
        };
    }
}(this, 'go2o', function() {

    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         meging target to params.
     */
    var _extend = function extend(target) {
        if (!target) return {};

        var sources = [].slice.call(arguments, 1);
        sources.forEach(function(source) {
            for (var property in source) {
                if (source[property] && source[property].constructor &&
                    source[property].constructor === Object) {
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
    var _shimConsole = function() {
        var empty = {},
            con = {},
            noop = function() {},
            properties = 'memory'.split(','),
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
                'table,time,timeEnd,timeStamp,trace,warn').split(','),
            prop,
            method;

        while (method = methods.pop()) con[method] = noop;
        while (prop = properties.pop()) con[prop] = empty;

        return con;
    };

    /**
     * Get keys in the `src` object not
     * present in the `tgt` object.
     * @param  {Object} src Source Object
     * @param  {Object} tgt Target Object
     * @return {Array}      Array with keys
     */
    var _diff = function(src, tgt) {
        if (!src) return Object.keys(tgt);
        if (!tgt) return [];
        var keys = Object.keys(tgt);
        return Object.keys(src).filter(function(i) {
            return keys.indexOf(i) < 0;
        });
    };

    /**
     * Unique elements in array.
     * @param  {Array} src Source array
     * @return {Array}     Filtered array, no dups
     */
    var _unique = function(src) {
        return src.filter(function(i, pos, self) {
            return self.indexOf(i) === pos;
        });
    };

    var _isFunction = function(src, key) {
        return src && key && src[key] && typeof src[key] === 'function';
    };

    ///////////////////////////////////////////////////
    /// HELPER JSON
    /// TODO: Implement as plugin?
    /// Go2o.use(Flattener);
    ///////////////////////////////////////////////////
    //{
    var Parser = {};
    /**
     * Flatten a deeply nested object into a map of a
     * single level where the keys match to original
     * string path of the property.
     *
     * @param  {Object} src    Object to be serialized
     * @return {Object}        Serialized object.
     */
    Parser.flatten = function flatten(src, /*private*/ prop, output) {
        prop || (prop = '');
        output || (output = {});

        if (Object(src) !== src) output[prop] = src;
        else if (Array.isArray(src)) {
            for (var i = 0, l = src.length; i < l; i++) {
                flatten(src[i], prop ? prop + '.' + i : '' + i, output);
            }
            if (l === 0) output[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in src) {
                isEmpty = false;
                flatten(src[p], prop ? prop + '.' + p : p, output);
            }
            if (isEmpty) output[prop] = {};
        }

        return (isEmpty === true) ? {} : output;
    };

    /**
     * Unflatten a map of string path keys
     * and values to a fully nested object.
     *
     * @param  {Object} src Map to be unmapped
     * @return {Object}
     */
    Parser.unflatten = function(src) {
        if (Object(src) !== src || Array.isArray(src)) return src;

        var result = {}, cur, prop, idx, last, temp;
        for (var p in src) {
            cur = result, prop = '__ROOT__', last = 0;

            do {
                idx = p.indexOf('.', last);
                temp = p.substring(last, idx !== -1 ? idx : undefined);
                cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
                prop = temp;
                last = idx + 1;
            } while (idx >= 0);

            cur[prop] = src[p];
        }

        return result['__ROOT__'] || {};
    };

    /**
     * Captures all object keys that match
     * a regexp pattern
     * @param  {Object} map     Source object
     * @param  {RegExp} pattern Matcher
     * @return {Object}         Object with the
     *                          subset of properties
     *                          matching `pattern`
     */
    Parser.glob = function(map, pattern) {
        map || (map = {});
        var out = {};
        Object.keys(map).forEach(function(key) {
            if (key.match(pattern)) out[key] = map[key];
        });
        return out;
    };
    //}
    ///////////////////////////////////////////////////
    // CONSTRUCTOR
    ///////////////////////////////////////////////////

    var OPTIONS = {
        /*
         * List of attributes that get initialized even
         * if not specified on the config object.
         */
        attributes: ['schema', 'transforms', 'flattened', 'matchers',
            'transformers', 'processors', 'preprocessors', 'postprocessors',
            'handledKeys'
        ],
        /*
         * Should we override output in case
         * of conflict, ie: object merge.
         */
        overrideOnConflict: true,
        /*
         * This pre-process should always
         * happen BEFORE than any other process
         */
        defaultPre: ['flattenPaths'],
        /*
         * This two processes should always happen,
         * unflattenPaths should always be the last
         * process to run.
         */
        defaultPost: ['mergeOrphans', 'unflattenPaths']
    };

    /**
     * Go2o constructor
     *
     * @param  {object} config Configuration object.
     */
    var Go2o = function(config) {
        //TODO: We want to only merge in valid attributes!!
        //not the whole config object!
        config = config || {};
        config = _extend({}, this.constructor.DEFAULTS, config);

        this.init(config);
    };

    Go2o.VERSION = '0.3.0';

    /**
     * Make default options available so we
     * can override.
     */
    Go2o.DEFAULTS = OPTIONS;

    ///////////////////////////////////////////////////
    // PUBLIC METHODS
    ///////////////////////////////////////////////////

    Go2o.prototype.init = function(config) {
        if (this.initialized) return this.logger.warn('Already initialized');
        this.initialized = true;

        console.log('Go2o: Init!', config);


        _extend(this, config);

        /*
         * Create attributes.
         */
        OPTIONS.attributes.forEach(function(prop) {
            this.hasOwnProperty(prop) || (this[prop] = {});
        }, this);

        this.initializeProcessors();

        this.registerDefaultTransformations();
    };

    Go2o.prototype.initializeProcessors = function() {
        /*
         * We need to ensure that we kick start
         * pre/post collections.
         */
        this.pre || (this.pre = []);
        this.pre = _unique(this.defaultPre.concat(this.pre));

        this.post || (this.post = []);
        this.post = _unique(this.post.concat(this.defaultPost));
    };

    Go2o.prototype.registerDefaultTransformations = function() {
        /*****************************************
         * ADDING SAMPLE TRANSFORMATIONS. MOVE OUT
         *****************************************/
        this.addTransformer('rename', function rename(path, options) {
            if (typeof options === 'object' && options.glob === true) {
                Object.keys(this.flattened).forEach(function(key) {
                    if (!key.match(options.matcher)) return;
                    var name = key;
                    if (typeof options.execute === 'function') {
                        name = options.execute(key, path, options);
                    }

                    this.output[name] = this.flattened[key];
                    delete this.flattened[key];
                }, this);

                return true;
            } else if (!this.flattened.hasOwnProperty(path)) return false;

            console.log('=> rename %s to %s', path, options);
            this.output[options] = this.flattened[path];
            delete this.flattened[path];

            return true;
        });

        this.addTransformer('collapse', function collapse(path, name) {
            if (!this.flattened.hasOwnProperty(path)) return false;
            // console.log('=> collapse %s to %s', path, name);
            if (!this.output.hasOwnProperty(name)) this.output[name] = [];
            this.output[name].push(this.flattened[path]);
            return true;
        });

        this.addTransformer('remove', function remove(path, options) {
            if (typeof options === 'object' && options.glob === true) {
                Object.keys(this.flattened).forEach(function(key) {
                    if (!key.match(options.matcher)) return;
                    delete this.flattened[key];
                }, this);
            } else if (!this.flattened.hasOwnProperty(path)) return false;

            delete this.flattened[path];
            return true;
        });

        /*
         * Flatten source object into map. After this point we are
         * ready to apply our transformations.
         */
        this.addPreprocessor('flattenPaths', function flattenPaths() {
            console.warn('flattenPaths');
            this.flattened = Parser.flatten(this.source);
        });

        /*
         * Post processor that merges untransformed keys into the
         * output object.
         */
        this.addPostprocessor('mergeOrphans', function mergeOrphans() {
            /*
             * Collect all keys in the original map that were
             * not handled.
             */
            var orphans = _diff(this.flattened, this.handledKeys),
                fname = arguments.callee.name;

            orphans.forEach(function(key) {
                if (this.output.hasOwnProperty(key)) {
                    this.solveConflict(key);
                } else this.output[key] = this.flattened[key];
            }, this);
        });

        /*
         * We are done, rehydrate our object from the map.
         */
        this.addPostprocessor('unflattenPaths', function() {
            this.output = Parser.unflatten(this.output);
        });
    };

    /**
     * Simple method to solve conflict when
     * merging elements.
     * @param  {String} key Element ID
     * @return {void}
     */
    Go2o.prototype.solveConflict = function(key) {
        this.logger.warn('Conflict, solving for key', key);

        if (this.overrideOnConflict === true) {
            this.logger.warn('√ now %s, had value %s', this.flattened[key], this.output[key]);
            this.output[key] = this.flattened[key];
        } else {
            this.logger.warn('= now %s, ignore %s', this.output[key], this.flattened[key]);
        }
    };

    /**
     * Run processes and transformations.
     * @param  {Object} data Object to which
     *                       we want to modify.
     * @return {Object}      Transformed object.
     */
    Go2o.prototype.run = function(data) {
        console.log('parsing', data);

        this.source = _extend({}, data);

        //this is a reset
        this.output = {};
        this.handledKeys = {};

        this.runPre();

        //Iterate over the source properties in transforms:
        Object.keys(this.transforms).map(this.applyTransformTo, this);

        //after we run all trasforms, we should pic all properties of
        //original object and append those to the output.
        this.runPost();

        return this.output;
    };

    Go2o.prototype.applyTransformTo = function(path) {
        var rules = this.transforms[path],
            arg = null,
            handled = false;

        //for now we assume that all schema values are objs.
        Object.keys(rules).forEach(function(event) {
            arg = rules[event];

            if (!_isFunction(this.transformers, event)) return;

            handled = this.transformers[event].call(this, path, arg);
            if (handled === true) this.handledKeys[path] = true;
        }, this);
    };

    /**
     * Transformation method attached to `event`
     * key.
     * TODO: Transformer should be an object:
     * ```
     *     var transformer = {
     *         id: 'rename',
     *         check: function(path, name){
     *             return this.flattened.hasOwnProperty(path);
     *         },
     *         execute: function(path, name){
     *             this.output[name] = this.flattened[path];
     *         }
     *     };
     * ```
     * @param {String} event       Name to trigger
     *                             transformation.
     * @param {this}
     */
    Go2o.prototype.addTransformer = function(event, transformer) {
        //WE REALLY WANT TO DO THIS WITH EVENTS!!
        // this.on(transformer.key, transformer.execute);
        this.transformers[event] = transformer;
        return this;
    };

    Go2o.prototype.addPostprocessor = function(id, post) {
        this.postprocessors[id] = post;
        return this;
    };

    Go2o.prototype.addPreprocessor = function(id, pre) {
        this.preprocessors[id] = pre;
        return this;
    };

    Go2o.prototype.runPost = function() {
        var processId;
        Object.keys(this.post).forEach(function(id) {
            processId = this.post[id];
            if (!_isFunction(this.postprocessors, processId)) return;
            this.postprocessors[processId].call(this);
        }, this);

        return this;
    };

    Go2o.prototype.runPre = function() {
        var processId;
        Object.keys(this.pre).forEach(function(id) {
            processId = this.pre[id];

            if (!_isFunction(this.preprocessors, processId)) return;

            this.preprocessors[processId].call(this);
        }, this);
        return this;
    };

    /**
     * Logger method, meant to be implemented by
     * mixin. As a placeholder, we use console if available
     * or a shim if not present.
     */
    Go2o.prototype.logger = console || _shimConsole();

    /*****************************
     * EXPOSE HELPERS, FOR TESTING.
     ******************************/
    Go2o.helpers = {};
    Go2o.helpers.diff = _diff;
    Go2o.helpers.extend = _extend;
    Go2o.helpers.isFunction = _isFunction;
    Go2o.helpers.Parser = Parser;

    return Go2o;
}));