/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'go2o': 'go2o'
    }
});

define(['go2o', 'jquery'], function(Go2o, $) {
    console.log('Loading');

    /*
     * WE HAVE OUR SOURCE OBJECT.
     */
    var json = {
        "type": "event",
        "name": "config_available",
        "scene": "3b-provisions",
        "payload": {
            "bill": {
                "_id": "535a7950e4b07d4c5ee63a54",
                "title": "This is a title",
                "billPurpose": "this is nothing",
                "provisions": {
                    "provisions": [{
                        "_id": "534715f2e4b052a43d84e922",
                        "name": "Heavily Tax Fracking Companies",
                        "impacts": [{
                            "_id": "532b0ceee4b0d782629bc623",
                            "name": "Jobs",
                            "direction": "DOWN"
                        }, {
                            "_id": "532afb06e4b0d782629bc5c5",
                            "name": "Environment",
                            "direction": "NEUTRAL"
                        }, {
                            "_id": "532afab7e4b0d782629bc5bf",
                            "name": "Oil",
                            "direction": "DOWN"
                        }]
                    }]
                }
            },
            "committee": {
                "_id": "5339c243e4b01dbc9cf97c00",
                "name": "Bill Building Committee",
                "committeeType": "BILL_BUILDING",
                "subCommittees": [{
                    "_id": "5339c24be4b01dbc9cf97c02",
                    "name": "Great Subcommittee",
                    "provisions": [{
                        "_id": "533a483de4b0c5a5e15150f4",
                        "name": "Provision Whatever",
                        "impacts": ['impact1', 'impact2']
                    }],
                    "hearingQuestions": [{
                        id: 1,
                        question: "hello?"
                    }, {
                        id: 2,
                        question: "what?"
                    }, {
                        id: 3,
                        question: "who?"
                    }, ],
                    "expertInfo": {
                        "nomineeName": "Lorem ipsum here, nothing more",
                        "nomineeTitle": "Lorem ipsum here, nothing more",
                        "nomineeFor": "Lorem ipsum here, nothing more",
                        "nomineeBio": "Lorem ipsum here, nothing more"
                    }
                }],
                "amendments": [{
                    "_id": "53458344e4b07375b113fab0",
                    "name": "Gun Control",
                    "party": {
                        "_id": "534582f7e4b07375b113faa2",
                        "name": "Republican",
                        "impacts": [{
                            "impact": {
                                "_id": "532afaeee4b0d782629bc5c3",
                                "name": "Taxes",
                                "direction": "UP"
                            },
                            "explanation": "Unfortunately, if you're building wind farms, you need to raise money to do it.  That probably means higher taxes..."
                        }, {
                            "impact": {
                                "_id": "532b0ceee4b0d782629bc623",
                                "name": "Jobs",
                                "direction": "UP"
                            },
                            "explanation": "SOMEONE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                        }, {
                            "impact": {
                                "_id": "542b0ceee4b0d782649bc624",
                                "name": "Pets",
                                "direction": "DOWN"
                            },
                            "explanation": "HE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                        }]
                    },
                    "faction": {
                        "_id": "5339c22be4b01dbc9cf97bfe",
                        "name": "Republic Faction"
                    },
                    "negativeExplanation": "Suck it",
                    "impacts": [{
                        "impact": {
                            "_id": "532afaeee4b0d782629bc5c3",
                            "name": "Taxes",
                            "direction": "UP"
                        },
                        "explanation": "Unfortunately, if you're building wind farms, you need to raise money to do it.  That probably means higher taxes..."
                    }, {
                        "impact": {
                            "_id": "532b0ceee4b0d782629bc623",
                            "name": "Jobs",
                            "direction": "UP"
                        },
                        "explanation": "SOMEONE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                    }, {
                        "impact": {
                            "_id": "542b0ceee4b0d782649bc624",
                            "name": "Pets",
                            "direction": "DOWN"
                        },
                        "explanation": "HE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                    }]
                }, {
                    "_id": "53453333e4b07375b113fab3",
                    "name": "Pet Control",
                    "party": {
                        "_id": "534582f7e4b07375b113fbbb",
                        "name": "Republican",
                        "impacts": [{
                            "impact": {
                                "_id": "532afaeee4b0d782629bc5c3",
                                "name": "Taxes",
                                "direction": "UP"
                            },
                            "explanation": "Unfortunately, if you're building wind farms, you need to raise money to do it.  That probably means higher taxes..."
                        }, {
                            "impact": {
                                "_id": "532b0ceee4b0d782629bc623",
                                "name": "Jobs",
                                "direction": "UP"
                            },
                            "explanation": "SOMEONE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                        }, {
                            "impact": {
                                "_id": "542b0ceee4b0d782649bc624",
                                "name": "Pets",
                                "direction": "DOWN"
                            },
                            "explanation": "HE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                        }]
                    },
                    "faction": {
                        "_id": "5339c22be4b01dbc9cf97fff",
                        "name": "Republic Faction"
                    },
                    "negativeExplanation": "Fuck it",
                    "impacts": [{
                        "impact": {
                            "_id": "532afaeee4b0d782629bc5c3",
                            "name": "Taxes",
                            "direction": "UP"
                        },
                        "explanation": "Unfortunately, if you're building wind farms, you need to raise money to do it.  That probably means higher taxes..."
                    }, {
                        "impact": {
                            "_id": "532b0ceee4b0d782629bc623",
                            "name": "Jobs",
                            "direction": "UP"
                        },
                        "explanation": "SOMEONE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                    }, {
                        "impact": {
                            "_id": "542b0ceee4b0d782649bc624",
                            "name": "Pets",
                            "direction": "DOWN"
                        },
                        "explanation": "HE needs to build all those wind turbines.  More investement in wind farms means more energy industry jobs."
                    }]
                }]
            }
        }
    };

    //Execute the transform
    var output = makeSchemaTransform(json);

    /**
     * Our transformation method.
     * Here we describe the schema that will
     * map our transformations.
     */
    function makeSchemaTransform(data) {
        /*
         * Schema holds the transformations
         * we want to apply.
         */
        var schema = {
            pre: ['flattenPaths', 'renameAllIds', 'unwrapProvisions'],
            post: ['mergeOrphans', 'unflattenPaths'],
            preprocessors: {
                renameAllIds: function() {
                    Object.keys(this.flattened).forEach(function(path) {
                        if (!path.match(/_id/)) return;
                        var out = path.replace(/_id/, 'id'),
                            value = this.flattened[path];
                        this.flattened[out] = value;
                        delete this.flattened[path];
                    }, this);
                },
                unwrapProvisions: function() {
                    Object.keys(this.flattened).forEach(function(path) {
                        console.info('UNWRAP', path)
                        if (!path.match(/payload.bill.provisions.provisions/)) return;
                        var out = path.replace(/payload.bill.provisions.provisions/, 'payload.bill.provisions'),
                            value = this.flattened[path];
                        this.flattened[out] = value;
                        delete this.flattened[path];
                    }, this);
                }
            },
            transforms: {
                'payload.bill.billPurpose': {
                    rename: 'payload.bill.description'
                },
                'payload.bill.title': {
                    rename: 'payload.bill.name'
                },
                address1: {
                    collapse: 'direccion'
                },
                address2: {
                    collapse: 'direccion'
                },
                'payload.committee.committeeType': {
                    remove: false
                },
                'payload.committee.subCommittees': {
                    remove: {
                        glob: true,
                        matcher: /payload\.committee\.subCommittees/
                    }
                },
                'payload.committee.amendments.#.party': {
                    remove: {
                        glob: true,
                        matcher: /payload\.committee\.amendments\.\d+\.party/
                    }
                },
                'payload.committee.amendments.#.impacts.#.explanation': {
                    remove: {
                        glob: true,
                        matcher: /payload\.committee\.amendments\.(\d+)\.impacts\.(\d+)\.explanation/
                    }
                },
                'payload.committee.amendments.#.impacts.#.impact': {
                    rename: {
                        glob: true,
                        matcher: /payload\.committee\.amendments\.(\d+)\.impacts\.(\d+)\.impact/,
                        name: function(key, path, options) {
                            return key.replace('.impact.', '.');
                        }
                    }
                }

            }
        };
        var go = new Go2o(schema),
            output = go.run(data);

        window.go = go;
        console.log('We have new output', output);
    }
});