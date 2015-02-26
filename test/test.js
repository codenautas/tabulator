
var expect = require('expect.js');
var assert = require('assert');
var http = require('http');
var path = require('path');
var request = require('supertest');
var tabulator = require('..');

describe('tabulator', function(){
    describe('createSimpleCellFromString', function(){
        it('should create an object with one property', function(done){
            var simpleCell=tabulator.createSimpleCellFromString("hola 'che'. ¿tenés < de 5 años?");
            expect(simpleCell).to.eql({show: "hola 'che'. ¿tenés < de 5 años?"});
            // assert.equal(simpleCell,{show: "hola 'che'. ¿tenés < de 5 años?"});
        });
    });
    describe('render', function(){
        var simple=tabulator.createSimpleCellFromString;
        it('should render a 2x3 matrix into a html table', function(){
            var matrix={
                lines:[{
                    cells:[simple("one"), simple("two"), simple("three")]
                },{
                    cells:["alpha", "betha", "gamma"].map(function(text){ return simple(text); })
                }]
            };
            var html=tabulator.render(matrix,{pretty:true});
            expect(html).to.eql(
                "<table>\n"+
                "  <tbody>\n"+
                "    <tr>\n"+
                "      <td>one</td>\n"+
                "      <td>two</td>\n"+
                "      <td>three</td>\n"+
                "    </tr>\n"+
                "    <tr>\n"+
                "      <td>alpha</td>\n"+
                "      <td>betha</td>\n"+
                "      <td>gama</td>\n"+
                "    </tr>\n"+
                "  </tbody>\n"+
                "</table>"
            );
        });
        it('should escape when render', function(){
            var countCall2escape=0;
            tabulator.escape=function(pureText){
                countCall2escape++;
                return "#"+pureText+"#";
            }
            var matrix={lines:[{cells:[simple("3<4 & 3>1")]}]};
            var html=tabulator.render(matrix); // not pretty
            expect(html).to.eql("<table><tbody><tr><td>#3<4 & 3>1#</td></tr></tbody></table>");
        });
        
    });
});


function createServer(opts, fn) {
    var _serve = tabulator(opts);
    return http.createServer(function (req, res) {
        fn && fn(req, res);
        _serve(req, res, function (err) {
            res.statusCode = err ? (err.status || 500) : 404;
            res.end(err ? err.stack : 'sorry!');
        });
    });
}
