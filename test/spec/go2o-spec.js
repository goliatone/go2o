/*global define:true, describe:true , it:true , expect:true,
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(function(require) {
    var Go2o = require('go2o');

    describe('Go2o helpers', function() {

        it('should be accessible through the helpers namespace', function() {
            expect(Go2o.helpers).toBeTruthy();
        });
        it('should have a different helper methods', function() {
            var helpers = ['diff', 'extend', 'Parser'];
            expect(Go2o.helpers).toHaveProperties('diff', 'extend', 'Parser');
        });
    });

    describe('Go2o diff helper', function() {
        it('should have a diff helper', function() {
            var diff = Go2o.helpers.diff,
                src = {
                    foo: 'foo',
                    bar: 'bar'
                },
                tgt = {
                    foo: 'foo',
                    baz: 'baz'
                },
                exp = ['bar'];
            expect(diff).toBeTruthy();
            expect(diff(src, tgt)).toMatchObject(exp);
        });

        it('diff helper should handle undefined target argument', function() {
            var diff = Go2o.helpers.diff,
                src = {
                    foo: 'foo',
                    baz: 'baz'
                },
                tgt = null,
                exp = [];
            expect(diff).toBeTruthy();
            expect(diff(src, tgt)).toMatchObject(exp);
        });

        it('diff helper should handle undefined source argument', function() {
            var diff = Go2o.helpers.diff,
                src = null,
                tgt = {
                    foo: 'foo',
                    baz: 'baz'
                },
                exp = ['foo', 'baz'];
            expect(diff).toBeTruthy();
            expect(diff(src, tgt)).toMatchObject(exp);
        });
    });

    describe('extend helper', function() {
        it('should handle no arguments by returning a new object', function() {
            var extend = Go2o.helpers.extend;
            expect(extend()).toMatchObject({});
        });

        it('extend the target object with the properties of objects passed as arguments', function() {
            var source = {},
                target = {
                    foo: 'foo',
                    bar: 'bar'
                },
                output = {
                    foo: 'foo',
                    bar: 'bar'
                },
                extend = Go2o.helpers.extend;
            expect(extend(source, target)).toMatchObject(output);
        });

        it('extend the target object with the properties of multiple objects passed as arguments', function() {
            var source = {},
                target = {
                    foo: 'foo'
                },
                target2 = {
                    bar: 'bar'
                },
                output = {
                    foo: 'foo',
                    bar: 'bar'
                },
                extend = Go2o.helpers.extend;
            expect(extend(source, target, target2)).toMatchObject(output);
        });

        it('target objects should override source properties', function() {
            var source = {
                foo: 'fiz',
                bar: 'biz'
            },
                target = {
                    foo: 'foo',
                    bar: 'bar'
                },
                output = {
                    foo: 'foo',
                    bar: 'bar'
                },
                extend = Go2o.helpers.extend;
            expect(extend(source, target)).toMatchObject(output);
        });

        it('multiple target objects should override source properties', function() {
            var source = {
                foo: 'fiz',
                bar: 'biz'
            },
                target = {
                    foo: 'foo',
                    bar: 'bir'
                },
                target2 = {
                    bar: 'bar'
                },
                output = {
                    foo: 'foo',
                    bar: 'bar'
                },
                extend = Go2o.helpers.extend;
            expect(extend(source, target, target2)).toMatchObject(output);
        });
    });

    describe('Object helper should', function() {
        it('have a flatten method', function() {
            expect(Go2o.helpers.Parser.flatten).toBeTruthy();
            expect(Go2o.helpers.Parser.flatten).toBeOfType('function');
        });

        it('have a flatten unflatten', function() {
            expect(Go2o.helpers.Parser.unflatten).toBeTruthy();
            expect(Go2o.helpers.Parser.unflatten).toBeOfType('function');
        });

        it('have a flatten glob', function() {
            expect(Go2o.helpers.Parser.glob).toBeTruthy();
            expect(Go2o.helpers.Parser.glob).toBeOfType('function');
        });

        it('flatten medthod should take an object and return a map with string paths to values', function() {
            var source = [{
                "impact": {
                    "id": "1",
                    "name": "Taxes",
                    "direction": "UP"
                },
                "explanation": "Lorem ipsum"
            }, {
                "impact": {
                    "id": "2",
                    "name": "Jobs",
                    "direction": "UP"
                },
                "explanation": "Lorem ipsum"
            }];

            var expected = {
                "0.impact.id": "1",
                "0.impact.name": "Taxes",
                "0.impact.direction": "UP",
                "0.explanation": "Lorem ipsum",
                "1.impact.id": "2",
                "1.impact.name": "Jobs",
                "1.impact.direction": "UP",
                "1.explanation": "Lorem ipsum"
            };
            var Parser = Go2o.helpers.Parser;

            expect(Parser.flatten(source)).toMatchObject(expected);
        });

        it('unflatten medthod should take a map with string paths and return an object', function() {
            var expected = [{
                "impact": {
                    "id": "1",
                    "name": "Taxes",
                    "direction": "UP"
                },
                "explanation": "Lorem ipsum"
            }, {
                "impact": {
                    "id": "2",
                    "name": "Jobs",
                    "direction": "UP"
                },
                "explanation": "Lorem ipsum"
            }];

            var source = {
                "0.impact.id": "1",
                "0.impact.name": "Taxes",
                "0.impact.direction": "UP",
                "0.explanation": "Lorem ipsum",
                "1.impact.id": "2",
                "1.impact.name": "Jobs",
                "1.impact.direction": "UP",
                "1.explanation": "Lorem ipsum"
            };
            var Parser = Go2o.helpers.Parser;

            expect(Parser.unflatten(source)).toMatchObject(expected);
        });

        it('glob should filter a map properties using a regexp', function() {
            var source = {
                "0.impact.id": "1",
                "0.impact.name": "Taxes",
                "0.impact.direction": "UP",
                "0.explanation": "Lorem ipsum",
                "1.impact.id": "2",
                "1.impact.name": "Jobs",
                "1.impact.direction": "UP",
                "1.explanation": "Lorem ipsum"
            };
            var pattern = /\d+\.explanation/;
            var expected = {
                '0.explanation': 'Lorem ipsum',
                '1.explanation': 'Lorem ipsum'
            };
            var glob = Go2o.helpers.Parser.glob;

            expect(glob(source, pattern)).toMatchObject(expected);

        });
    });

});