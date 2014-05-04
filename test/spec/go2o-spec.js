/*global define:true, describe:true , it:true , expect:true, 
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(['go2o', 'jquery'], function(Go2o, $) {

    describe('just checking', function() {

        it('Go2o should be loaded', function() {
            expect(Go2o).toBeTruthy();
            var go2o = new Go2o();
            expect(go2o).toBeTruthy();
        });

        it('Go2o should initialize', function() {
            var go2o = new Go2o();
            var output   = go2o.init();
            var expected = 'This is just a stub!';
            expect(output).toEqual(expected);
        });
        
    });

});