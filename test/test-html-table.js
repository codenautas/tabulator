
var expect = require('expect.js');

var Tabulator = require('..');

describe('tabulator', function(){
    var tabulator;
    beforeEach(function(){
        tabulator=new Tabulator();
    });
    describe('toHtmlTable', function(){
        it.skip('should render a 2x3 matrix into a html table', function(){
            var matrix={
                lines:[{
                    cells:["one", "two", "three"]
                },{
                    cells:["alpha", "betha", "gamma"]
                }]
            };
            var html=tabulator.toHtmlTable(matrix,{pretty:true});
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
                "      <td>gamma</td>\n"+
                "    </tr>\n"+
                "  </tbody>\n"+
                "</table>\n"
            );
        });
        it.skip('should escape when render', function(){
            var countCall2toHtmlTd=0;
            tabulator.toHtmlTd=function(obj){
                countCall2toHtmlTd++;
                return '<TD attr='+obj.attr+'>'+obj.content+'</TD>';
            }
            var matrix={lines:[{cells:[{attr:'this', content:'that'}]}]};
            var html=tabulator.toHtmlTable(matrix); // not pretty
            expect(html).to.eql('<table><tbody><tr><TD attr=this>that</TD></tr></tbody></table>');
            expect(countCall2toHtmlTd).to.eql(1);
        });
        it.skip('should render titles', function(){
            var matrix={
                caption:"The caption",
                headers:[{
                    "status": "not defined yet"
                }],
                lines:[{
                    cells:["100", "51.1", "48.9"]
                },{
                    cells:["100", "51.5", "48.5"]
                }]
            };
            var html=tabulator.toHtmlTable(matrix,{pretty:true});
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
                "</table>\n"
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
