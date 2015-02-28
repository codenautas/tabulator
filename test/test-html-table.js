
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
        it.skip('should render headers', function(){
            var matrix={
                caption:"Data for zone and area by sex",
                lineVariables:['zone','area'],
                columnVariables:['sex'],
                columns:[
                    {titles:['both']},
                    {titles:['masc']},
                    {titles:['fem' ]}
                ]
            };
            var html=tabulator.toHtmlTable(matrix,{pretty:true});
            expect(html).to.contain("<table>\n"+
                "  <caption>Data for zone and area by sex</caption>\n"+
                "  <colgroup class=headers>\n"+
                "    <col class=zone>\n"+
                "    <col class=area>\n"+
                "  </colgroup>\n"+
                "  <colgroup class=data>\n"+
                "    <col class='{\"sex\":\"both\"}'>\n"+
                "    <col class='{\"sex\":\"masc\"}'>\n"+
                "    <col class='{\"sex\":\"fem\"}'>\n"+
                "  </colgroup>\n"+
                "  <thead>\n"+
                "    <tr>\n"+
                "      <th rowspan=2>zone</th>\n"+
                "      <th rowspan=2>area</th>\n"+
                "      <th colspan=3>sex</th>\n"+ //colspan=3 porque columns.length=3
                "    </tr>\n"+
                "    <tr>\n"+
                "      <th>both</th>\n"+
                "      <th>masc</th>\n"+
                "      <th>fem</th>\n"+
                "    </tr>\n"+
                "  </thead>\n"+
                "  <tbody>\n"
            );
        });
        it.skip('should render line titles', function(){
            var matrix={
                lines:[
                    { titles:['one','alpha','a'], cells:["101", "102"]},
                    { titles:['two','betha','b'], cells:["103", "104"]}
                ]
            };
            var html=tabulator.toHtmlTable(matrix,{pretty:true});
            expect(html).to.contain(
                "  <tbody>\n"+
                "    <tr>\n"+
                "      <th>one</th>\n"+
                "      <th>alpha</th>\n"+
                "      <th>a</th>\n"+
                "      <td>101</td>\n"+
                "      <td>102</td>\n"+
                "    </tr>\n"+
                "    <tr>\n"+
                "      <th>two</th>\n"+
                "      <th>betha</th>\n"+
                "      <th>b</th>\n"+
                "      <td>103</td>\n"+
                "      <td>104</td>\n"+
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
