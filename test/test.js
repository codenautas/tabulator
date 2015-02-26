
var expect = require('expect.js');
var assert = require('assert');
var http = require('http');
var path = require('path');
var request = require('supertest');
var tabulator = require('..');

describe('tabulator', function(){
    describe('createSimpleCellFromString', function(){
        it.skip('should create an object with one property', function(done){
            var simpleCell=tabulator.createSimpleCellFromString("hola 'che'. ¿tenés < de 5 años?");
            expect(simpleCell).to.eql({show: "hola 'che'. ¿tenés < de 5 años?"});
        });
    });
    describe('render', function(){
        var simple=tabulator.createSimpleCellFromString;
        it.skip('should render a 2x3 matrix into a html table', function(){
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
        it.skip('should escape when render', function(){
            var countCall2escape=0;
            tabulator.escape=function(pureText){
                countCall2escape++;
                return "#"+pureText+"#";
            }
            var matrix={lines:[{cells:[simple("3<4 & 3>1")]}]};
            var html=tabulator.render(matrix); // not pretty
            expect(html).to.eql("<table><tbody><tr><td>#3<4 & 3>1#</td></tr></tbody></table>");
        });
        it.skip('should render titles', function(){
            var matrix={
                caption:"The caption",
                headers:[{
                    "status": "not defined yet"
                }],
                lines:[{
                    cells:["100", "51.1", "48.9"].map(function(text){ return simple(text); })
                },{
                    cells:["100", "51.5", "48.5"].map(function(text){ return simple(text); })
                }]
            };
            var html=tabulator.render(matrix,{pretty:true});
            expect(html).to.eql(
                "<table>\n"+
                "  <caption>The caption</caption>\n"+
                "  <thead>\n"+
                "    <tr>\n"+
                "      <th></th>\n"+
                "      <th></th>\n"+
                "      <th></th>\n"+
                "      <th colspan=2>sex</th>\n"+
                "    </tr>\n"+
                "    <tr>\n"+
                "      <th>zone</th>\n"+
                "      <th>area</th>\n"+
                "      <th>Total</th>\n"+
                "      <th>masc</th>\n"+
                "      <th>fem</th>\n"+
                "    </tr>\n"+
                "  </thead>\n"+
                "  <tbody>\n"+
                "    <tr>\n"+
                "      <th rowspan=2>zone 1</th>\n"+
                "      <th>area 1</th>\n"+
                "      <td>one</td>\n"+
                "      <td>two</td>\n"+
                "      <td>three</td>\n"+
                "    </tr>\n"+
                "    <tr>\n"+
                "      <th>area 2</th>\n"+
                "      <td>alpha</td>\n"+
                "      <td>betha</td>\n"+
                "      <td>gama</td>\n"+
                "    </tr>\n"+
                "  </tbody>\n"+
                "</table>"
            );
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
