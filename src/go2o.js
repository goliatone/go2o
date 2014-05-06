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
}(this, "go2o", function() {

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

    ///////////////////////////////////////////////////
    /// HELPER JSON
    /// TODO: Implement as plugin?
    /// Go2o.use(Flattener);
    ///////////////////////////////////////////////////

    var Parser = {};
    Parser.unflatten = function(data) {
        "use strict";
        if (Object(data) !== data || Array.isArray(data))
            return data;
        var result = {}, cur, prop, idx, last, temp;
        for (var p in data) {
            cur = result, prop = "", last = 0;
            do {
                idx = p.indexOf(".", last);
                temp = p.substring(last, idx !== -1 ? idx : undefined);
                cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
                prop = temp;
                last = idx + 1;
            } while (idx >= 0);
            cur[prop] = data[p];
        }
        return result[""];
    };

    Parser.flatten = function(data) {
        var result = {};

        function recurse(cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                for (var i = 0, l = cur.length; i < l; i++)
                    recurse(cur[i], prop ? prop + "." + i : "" + i);
                if (l == 0)
                    result[prop] = [];
            } else {
                var isEmpty = true;
                for (var p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + "." + p : p);
                }
                if (isEmpty)
                    result[prop] = {};
            }
        }
        recurse(data, "");
        return result;
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
    var Go2o = function(config) {
        //TODO: We want to only merge in valid attributes!!
        //not the whole config object!
        config = config || {};
        config = _extend({}, this.constructor.DEFAULTS, config);

        this.init(config);
    };

    /**
     * Make default options available so we
     * can override.
     */
    Go2o.DEFAULTS = options;

    ///////////////////////////////////////////////////
    // PUBLIC METHODS
    ///////////////////////////////////////////////////

    Go2o.prototype.init = function(config) {
        if (this.initialized) return this.logger.warn('Already initialized');
        this.initialized = true;

        console.log('Go2o: Init!', config);

        _extend(this, config);


        var attributes = ['schema', 'transforms', 'flattened', 'matchers',
            'transformers', 'processors', 'preprocessors', 'postprocessors',
            'handledKeys'
        ];

        attributes.forEach(function(prop) {
            this.hasOwnProperty(prop) || (this[prop] = {});
        }, this);

        this.typeMap = {
            'String': 'transformers',
            'RegExp': 'matchers',
            'Function': 'processors'
        };

        /*****************************************
         * ADDING SAMPLE TRANSFORMATIONS. MOVE OUT
         *****************************************/
        this.addTransformer('rename', function(path, options) {
            if (typeof options === 'object' && options.glob === true) {

                Object.keys(this.flattened).forEach(function(key) {
                    if (!key.match(options.matcher)) return;
                    var name = key;
                    if (typeof options.name === 'function') {
                        name = options.name(key, path, options);
                    }

                    this.output[name] = this.flattened[key];
                    delete this.flattened[key];
                }, this);

                return true;
            } else if (!this.flattened.hasOwnProperty(path)) return false;

            // if (!this.flattened.hasOwnProperty(path)) return false;
            console.log('=> rename %s to %s', path, options);
            this.output[options] = this.flattened[path];
            delete this.flattened[path];
            return true;
        });

        this.addTransformer('collapse', function(path, name) {
            if (!this.flattened.hasOwnProperty(path)) return false;
            // console.log('=> collapse %s to %s', path, name);
            if (!this.output.hasOwnProperty(name)) this.output[name] = [];
            this.output[name].push(this.flattened[path]);
            return true;
        });

        this.addTransformer('remove', function(path, options) {
            if (typeof options === 'object' && options.glob === true) {
                Object.keys(this.flattened).forEach(function(key) {
                    if (!key.match(options.matcher)) return;
                    delete this.flattened[key];
                }, this);
            } else if (!this.flattened.hasOwnProperty(path)) return false;

            delete this.flattened[path];
            return true;
        });

        /*this.addTransformer(/address[1-9]/, function(path, collapse){
            console.info('=> matching %s with %s', path, collapse);

        });*/

        this.addPreprocessor('flattenPaths', function() {
            console.warn('flattenPaths')
            this.flattened = Parser.flatten(this.source);
        });

        this.addPostprocessor('mergeOrphans', function() {
            var orphans = _diff(this.flattened, this.handledKeys);
            orphans.forEach(function(key) {
                this.output[key] = this.flattened[key];
            }, this);
        });

        this.addPostprocessor('unflattenPaths', function() {
            this.output = Parser.unflatten(this.output);
        });
    };

    Go2o.prototype.run = function(data) {
        console.log('parsing', data);
        this.source = _extend({}, data);

        this.runPre();

        //For now we assume we want an Object as output
        //but we might want to go from Array to Object or from
        //Object to Array. That would be a transform in the 'root'
        this.output = {};

        //Iterate over the source properties in schema:
        Object.keys(this.transforms).forEach(this.applyTransformTo.bind(this));

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

            if (this.transformers.hasOwnProperty(event)) {
                handled = this.transformers[event].call(this, path, arg);
                if (handled === true) this.handledKeys[path] = true;
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
        var eventType = event.constructor.name; // this, fails in <IE9, shim
        var holder = this.typeMap[eventType];
        this[holder][event] = transformer;

        //WE REALLY WANT TO DO THIS WITH EVENTS!!
        // this.on(transformer.key, transformer.execute);
        return this;
    };

    Go2o.prototype.addPostprocessor = function(id, post) {
        this.postprocessors[id] = post;
        return this;
    };

    Go2o.prototype.addPreprocessor = function(id, post) {
        this.preprocessors[id] = post;
        return this;
    };

    Go2o.prototype.runPost = function() {
        var processId;
        Object.keys(this.post).forEach(function(id) {
            processId = this.post[id];
            this.postprocessors[processId].call(this);
        }, this);

        return this;
    };

    Go2o.prototype.runPre = function() {
        var processId;
        Object.keys(this.pre).forEach(function(id) {
            processId = this.pre[id];
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
    Go2o.helpers.Parser = Parser;

    return Go2o;
}));