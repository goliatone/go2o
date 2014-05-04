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
        name:'peperone',
        age:33,
        city:'New York',
        address1:'dekalb avenue',
        address2:'apt 34b',
        something:{
            depp:{
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
            post:['mergeOrphans'],
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
                }
            }
        };

        var go = new Go2o(schema),
            output = go.run(data);

        window.go = go;
        console.log('We have new output', output);
    }
});