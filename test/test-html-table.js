
var expect = require('expect.js');
var expectCalled = require('expect-called');
var jh = require('js-to-html');

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
            var html=tabulator.toHtmlTable(matrix);
            expect(html).to.be(jh.Internal);
            expect(html.toHtml({pretty:true})).to.eql(
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
        it.skip('should render headers', function(){
            var controlValue=expectCalled.control(tabulator.toHtmlThValue);
            var controlVariable=expectCalled.control(tabulator.toHtmlThVariable);
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
            expect(html.internal.content.slice(0,4)).to.eql([
                { tagName:'caption', textContent:'Data for zone and area by sex' },
                { tagName:'colgroup', attributes:{'class':'headers'}, content:[
                    {  tagName:'col', attributes:{'class':'zone'} }, 
                    {  tagName:'col', attributes:{'class':'area'} }
                ]}, 
                { tagName:'colgroup', attributes:{'class':'data'}, content:[
                    {  tagName:'col', attributes:{'class':'{\"sex\":\"both\"}'} }, 
                    {  tagName:'col', attributes:{'class':'{\"sex\":\"masc\"}'} },
                    {  tagName:'col', attributes:{'class':'{\"sex\":\"fem\"}'} }
                ]}, 
                { tagName:'thead', content:[
                    { tagName:'tr', content:[
                        { tagName:'th', attributes:{'class':'variable', 'rowspan':2}, textContent:'zone'},
                        { tagName:'th', attributes:{'class':'variable', 'rowspan':2}, textContent:'area'},
                        { tagName:'th', attributes:{'class':'variable', 'colspan':2}, textContent:'sex'},//colspan=3 porque columns.length=3
                    ]},
                    { tagName:'tr', content:[
                        { tagName:'th', attributes:{'class':'var_sex'}, textContent:'both'},
                        { tagName:'th', attributes:{'class':'var_sex'}, textContent:'masc'},
                        { tagName:'th', attributes:{'class':'var_sex'}, textContent:'fem'},
                    ]}
                ]}
            ]);
        });
        it.skip('should render line titles', function(){
            var matrix={
                lines:[
                    { titles:['one','alpha','a'], cells:["101", "102"]},
                    { titles:['two','betha','b'], cells:["103", "104"]}
                ]
            };
            var html=tabulator.toHtmlTable(matrix);
            expect(html.toHtml({pretty:true})).to.contain(
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
            expect(html.internal.content[0]).to.eql(
                { tagName:'tbody', content:[
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
                    "    </tr>\n"
                ]}
            );
        });
        it.skip('should render condense title lines and subtitles', function(){
            var matrix={
                lines:[
                    { titles:['group 1','bigs'  ,'a']},
                    { titles:['group 1','bigs'  ,'b']},
                    { titles:['group 1','smalls','a']},
                    { titles:['group 2','bigs'  ,'a']},
                    { titles:['group 2','bigs'  ,'b']},
                    { titles:['group 3','bigs'  ,'a']},
                ]
            };
            var html=tabulator.toHtmlTable(matrix);
            expect(html.toHtml()).to.contain("<tbody>"+
                "<tr>"+"<th colspan=3>group 1</th>"+"<th colspan=2>bigs</th>"+"<th>a</th>"+"</tr>"+
                "<tr>"                                                       +"<th>b</th>"+"</tr>"+
                "<tr>"                             +"<th>smalls</th>"        +"<th>a</th>"+"</tr>"+
                "<tr>"+"<th colspan=2>group 2</th>"+"<th colspan=2>bigs</th>"+"<th>a</th>"+"</tr>"+
                "<tr>"                                                       +"<th>b</th>"+"</tr>"+
                "<tr>"+"<th>group 3</th>"          +"<th>bigs</th>"          +"<th>a</th>"+"</tr>"+
                "</tbody>"+"</table>"
            );
        });
    });
    describe('toHtmlTable controls', function(){
        it.skip('should control the count of variables and header lines', function(){
            // if specified lineVariables
            var matrix={
                lineVariables:['1','2'],
                lines:[
                    { titles:['a','b'] },
                    { titles:['a','b'] },
                    { titles:['a','b','c'] },
                ]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/line 2 has 3 values but lineVariables has 2/);
        });
        it.skip('should control the count of variables and column headers', function(){
            var matrix={
                columnVariables:['sex'],
                columns:[
                    {titles:['both']},
                    {titles:[]},
                ]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/column 1 has 0 values but columnVariables has 1/);
        });
        it.skip('should control the existence of line headers', function(){
            var matrix={
                lineVariables:[],
                lines:[{titles:[]},{}]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/there are no titles in line 1 but lineVariables exists/);
        });
        it.skip('should control the existence of title columns', function(){
            var matrix={
                columnVariables:['sex'],
                columns:[{}]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/there are no titles in column 0 but columnVariables exists/);
        });
        it.skip('should control the count of cells and columns', function(){
            var matrix={
                columns:[{},{},{}],
                lines:[
                    {cells:[1,2,3]},
                    {cells:[1,2,3]},
                    {cells:[1]}
                ]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/line 2 has 1 cells but columns has 3/);
        });
        it.skip('should control the existence of cells', function(){
            var matrix={
                columns:[{},{},{}],
                lines:[{}]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/there are no cells in line 0 but columns exists/);
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
