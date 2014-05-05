/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'go2o': 'go2o'
    }
});

define(['go2o', 'jquery'], function (Go2o, $) {
    console.log('Loading');

	/*
     * WE HAVE OUR SOURCE OBJECT.
    */
    var json = {
        "type": "event",
        "name": "config_available",
        "scene": "3b-provisions",
        "payload":
          {
            "bill": {
                "_id" : "535a7950e4b07d4c5ee63a54",
                "title": "This is a title",
                "billPurpose": "this is nothing",
                "provisions" : {
                    "provisions" : [
                      {
                        "_id" : "534715f2e4b052a43d84e922",
                        "name" : "Heavily Tax Fracking Companies",
                        "impacts" : [
                            {
                              "_id" : "532b0ceee4b0d782629bc623",
                              "name" : "Jobs",
                              "direction" : "DOWN"
                            },
                            {
                              "_id" : "532afb06e4b0d782629bc5c5",
                              "name" : "Environment",
                              "direction" : "NEUTRAL"
                            },
                            {
                              "_id" : "532afab7e4b0d782629bc5bf",
                              "name" : "Oil",
                              "direction" : "DOWN"
                            }
                        ]
                      }
                   ]
                }
            },
            "committee":
            {
              "_id" : "5339c243e4b01dbc9cf97c00",
              "name" : "Bill Building Committee",
              "committeeType" : "BILL_BUILDING",
              "subCommittees" : [
                      {
                        "_id" : "5339c24be4b01dbc9cf97c02",
                        "name" : "Great Subcommittee",
                        "provisions" : [
                            {
                              "_id" : "533a483de4b0c5a5e15150f4",
                              "name" : "Provision Whatever",
                              "impacts" : [ 'impact1','impact2' ]
                            }
                        ],
                        "hearingQuestions" : [
                            {id:1, question:"hello?"},
                            {id:2, question:"what?"},
                            {id:3, question:"who?"},
                        ],
                        "expertInfo" : {
                        "nomineeName" : "Lorem ipsum here, nothing more",
                        "nomineeTitle" : "Lorem ipsum here, nothing more",
                        "nomineeFor" : "Lorem ipsum here, nothing more",
                        "nomineeBio" : "Lorem ipsum here, nothing more"
                      }
                    }
                ],
                "amendments" : [
                      {
                        "_id" : "53458344e4b07375b113fab0",
                        "name" : "Gun Control",
                        "party" : {
                          "_id" : "534582f7e4b07375b113faa2",
                          "name" : "Republican",
                          "impacts" : []
                        },
                        "faction" : {
                          "_id" : "5339c22be4b01dbc9cf97bfe",
                          "name" : "Republic Faction"
                        },
                        "negativeExplanation" : "Suck it",
                        "impacts" : [
                            {
                              "_id" : "5339c212e4b01dbc9cf97bf6",
                              "name" : "Impact 2 Updated",
                              "direction" : "UP"
                            },
                            {
                              "_id" : "5339c218e4b01dbc9cf97bf8",
                              "name" : "Impact 3",
                              "direction" : "UP"
                            },
                            {
                              "_id" : "5339c21de4b01dbc9cf97bfa",
                              "name" : "Impact 4 Updated",
                              "direction" : "UP"
                            }
                        ]
                    }
                ]
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
    function makeSchemaTransform(data){
        /*
         * Schema holds the transformations
         * we want to apply.
         */
        var schema = {
            pre:  ['flattenPaths', 'renameAllIds', 'unwrapProvisions'],
            post: ['mergeOrphans', 'unflattenPaths'],
            preprocessors:{
                renameAllIds:function(){
                    Object.keys(this.flattened).forEach(function(path){
                        if(!path.match(/_id/)) return;
                        var out = path.replace(/_id/, 'id'),
                            value = this.flattened[path];
                        this.flattened[out] = value;
                        delete this.flattened[path];
                    }, this);
                },
                unwrapProvisions: function(){
                    Object.keys(this.flattened).forEach(function(path){
                        if(!path.match(/payload.bill.provisions.provisions/)) return;
                        var out = path.replace(/payload.bill.provisions.provisions/, 'payload.bill.provisions'),
                            value = this.flattened[path];
                        this.flattened[out] = value;
                        delete this.flattened[path];
                    }, this);
                }
            },
            schema:{
                'name':{
                    rename:'nombre'
                },
                'age':{
                    rename:'edad'
                },
                'city':{
                    //the key is the trigger for the transform.
                    rename:'ciudad',
                },
                address1:{
                    collapse:'direccion'
                },
                address2:{
                    collapse:'direccion'
                },
                'payload.bill.provisions.provisions':{
                    rename: 'payload.bill.provisions'
                }
            }
        };
        var go = new Go2o(schema),
            output = go.run(data);

        window.go = go;
        console.log('We have new output', output);
    }
});