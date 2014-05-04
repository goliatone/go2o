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
        _id:22222,
        user:{
            _id:33333,
            name:'someting'
        },
        name:'peperone',
        age:33,
        city:'New York',
        address1:'dekalb avenue',
        address2:'apt 34b',
        something:{
            deep:{
                to:{
                    see:{
                        merging:true
                    }
                }
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
            pre:  ['flattenPaths', 'renameAllIds'],
            post: ['mergeOrphans', 'unflattenPaths'],
            preprocessors:{
                renameAllIds:function(){
                    console.warn('peperone')
                    Object.keys(this.flattened).forEach(function(path){
                        console.info(path);
                        if(!path.match(/_id/)) return;
                        var out = path.replace(/_id/, 'id'),
                            value = this.flattened[path];
                        this.flattened[out] = value;
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
                'something.deep.to.see.merging':{
                    rename:'less.levels'
                }
            }
        };
        var go = new Go2o(schema),
            output = go.run(data);

        window.go = go;
        console.log('We have new output', output);
    }
});