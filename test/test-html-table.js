"use strict";

var expect = require('expect.js');
var expectCalled = require('expect-called');
var jsToHtml = require('js-to-html');
var html=jsToHtml.html;

var Tabulator = require('../tabulator.js');

describe('tabulator', function(){
    var tabulator;
    beforeEach(function(){
        tabulator=new Tabulator();
    });
    describe('toHtmlTable', function(){
        it('should render a 2x3 matrix into a html table', function(){
            var matrix={
                lines:[{
                    cells:["one", "two", "three"]
                },{
                    cells:["alpha", "betha", "gamma"]
                }]
            };
            var table=tabulator.toHtmlTable(matrix);
            expect(table).to.be.an(jsToHtml.Html);
            expect(table.toHtmlText({pretty:true})).to.eql(
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
            var matrix={
                caption:"Data for zone and area by sex",
                lineVariables:['zone','area'],
                columnVariables:['sex'],
                columns:[
                    {titles:['both']},
                    {titles:['masc']},
                    {titles:['fem' ]}
                ],
                lines:[]
            };
            var table=tabulator.toHtmlTable(matrix,{pretty:true});
            expect(table.content.slice(0,4)).to.eql([
                html.caption('Data for zone and area by sex'),
                html.colgroup({'class':'headers'}, [
                    html.col({'class':'zone'}), 
                    html.col({'class':'area'}), 
                ]), 
                html.colgroup({'class':'data'}, [
                    html.col({'class':'{\"sex\":\"both\"}'}), 
                    html.col({'class':'{\"sex\":\"masc\"}'}),
                    html.col({'class':'{\"sex\":\"fem\"}'})
                ]),
                html.thead([
                    html.tr([
                        html.th({'class':'variable', 'rowspan':2},'zone'),
                        html.th({'class':'variable', 'rowspan':2},'area'),
                        html.th({'class':'variable', 'colspan':2},'sex')//colspan=3 porque columns.length=3
                    ]),
                    html.tr([
                        html.th({'class':'var_sex'}, 'both'),
                        html.th({'class':'var_sex'}, 'masc'),
                        html.th({'class':'var_sex'}, 'fem')
                    ])
                ]),
                html.tbody()
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
            var htmlText=html.toHtmlText({pretty:true})
            var i=htmlText.indexOf('  <tbody>');
            expect(htmlText.substr(i)).to.eql(
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
        it.skip('should render condense title lines and subtitles', function(){
            var matrix={
                lines:[
                    { titles:['group 1','bigs'  ,'a'], cells:[]},
                    { titles:['group 1','bigs'  ,'b'], cells:[]},
                    { titles:['group 1','smalls','a'], cells:[]},
                    { titles:['group 2','bigs'  ,'a'], cells:[]},
                    { titles:['group 2','bigs'  ,'b'], cells:[]},
                    { titles:['group 3','bigs'  ,'a'], cells:[]},
                ]
            };
            var table=tabulator.toHtmlTable(matrix);
            expect(table.toHtmlText().replace(/<tr>/g,"\n<tr>")).to.eql("<table><tbody>"+
                "\n<tr>"+"<th colspan=3>group 1</th>"+"<th colspan=2>bigs</th>"+"<th>a</th>"+"</tr>"+
                "\n<tr>"                                                       +"<th>b</th>"+"</tr>"+
                "\n<tr>"                             +"<th>smalls</th>"        +"<th>a</th>"+"</tr>"+
                "\n<tr>"+"<th colspan=2>group 2</th>"+"<th colspan=2>bigs</th>"+"<th>a</th>"+"</tr>"+
                "\n<tr>"                                                       +"<th>b</th>"+"</tr>"+
                "\n<tr>"+"<th>group 3</th>"          +"<th>bigs</th>"          +"<th>a</th>"+"</tr>"+
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
                    { titles:['a','b']    , cells:[] },
                    { titles:['a','b']    , cells:[] },
                    { titles:['a','b','c'], cells:[] },
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
                    {titles:['both'], cells:[]},
                    {titles:[]      , cells:[]},
                ],
                lines:[]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/column 1 has 0 values but columnVariables has 1/);
        });
        it.skip('should control the existence of line headers', function(){
            var matrix={
                lineVariables:[],
                lines:[{titles:[], cells:[]}, {cells:[]}]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/there are no titles in line 1 but lineVariables exists/);
        });
        it.skip('should control the existence of title columns', function(){
            var matrix={
                columnVariables:['sex'],
                columns:[{}],
                lines:[]
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
                lines:[{cells:[]}]
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
