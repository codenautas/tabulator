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
                "<table class='tabulator-table'>\n"+
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
        it('should render a 1x1 matrix with an object in cell', function(){
            var matrix={
                lines:[{
                    cells:[{'attr-1':'value1', 'attr-2':'value2'}]
                }]
            };
            var itCallsToCellTable=0;
            tabulator.toCellTable=function(cell){
                expect(cell).to.eql({'attr-1':'value1', 'attr-2':'value2'});
                itCallsToCellTable++;
                return html.td(cell,"what to show & display");
            }
            var table=tabulator.toHtmlTable(matrix);
            expect(table).to.be.an(jsToHtml.Html);
            expect(table.toHtmlText({pretty:true})).to.eql(
                "<table class='tabulator-table'>\n"+
                "  <tbody>\n"+
                "    <tr>\n"+
                "      <td attr-1=value1 attr-2=value2>what to show &amp; display</td>\n"+
                "    </tr>\n"+
                "  </tbody>\n"+
                "</table>\n"
            );
            expect(itCallsToCellTable).to.eql(1);
        });
        it('should render a 1x1 matrix with an object in cell with default show attribute', function(){
            expect(tabulator.defaultShowAttribute).to.eql('show');
            tabulator.defaultShowAttribute='to-show';
            var matrix={
                lines:[{
                    cells:[{'attr-1':'value1', 'to-show':'what to display'}]
                }]
            };
            var table=tabulator.toHtmlTable(matrix);
            expect(table).to.be.an(jsToHtml.Html);
            expect(table.toHtmlText({pretty:true})).to.eql(
                "<table class='tabulator-table'>\n"+
                "  <tbody>\n"+
                "    <tr>\n"+
                "      <td attr-1=value1 to-show='what to display'>what to display</td>\n"+
                "    </tr>\n"+
                "  </tbody>\n"+
                "</table>\n"
            );
        });
        it('should render headers for only one column variable #2', function(){
            var matrix={
                caption:"Data for zone and area by sex",
                lineVariables:['zone','area'],
                columnVariables:['sex'],
                columns:[
                    {titles:[2]},
                    {titles:['masc']},
                    {titles:['fem' ]}
                ],
                lines:[],
                vars:{
                    zone:{
                        label:'The Zone'
                    }
                }
            };
            var table=tabulator.toHtmlTable(matrix,{pretty:true});
            expect(table.content).to.eql([
                html.caption('Data for zone and area by sex'),
                html.colgroup({'class':'headers'}, [
                    html.col({'class':'zone'}), 
                    html.col({'class':'area'}), 
                ]), 
                html.colgroup({'class':'data'}, [
                    html.col({'class':'{\"sex\":2}'}), 
                    html.col({'class':'{\"sex\":\"masc\"}'}),
                    html.col({'class':'{\"sex\":\"fem\"}'})
                ]),
                html.thead([
                    html.tr([
                        html.th({'class':'variable', rowspan:2},'The Zone'),
                        html.th({'class':'variable', rowspan:2},'area'),
                        html.th({'class':'variable', colspan:3},'sex')//colspan=3 porque columns.length=3
                    ]),
                    html.tr([
                        html.th({'class':'var_sex'}, 2),
                        html.th({'class':'var_sex'}, 'masc'),
                        html.th({'class':'var_sex'}, 'fem')
                    ])
                ]),
                html.tbody()
            ]);
        });
        it('should render headers for many column variables #3', function(){
            var matrix={
                caption:"Data for zone and area by sex",
                lineVariables:['zone','area'],
                columnVariables:['age_range', 'sex'],
                columns:[
                    {titles:['adult' ,2     ]},
                    {titles:['adult' ,'masc']},
                    {titles:['adult' ,'fem' ]},
                    {titles:['senior','fem' ]},
                    {titles:['senior','masc']},
                ],
                lines:[],
                vars:{
                    age_range:{
                        label:'Age Range',
                        values:{
                            adult: {label:'Adults 18-59'},
                            senior:{label:'Senior 60+'}
                        }
                    },
                    sex:{
                        label:'Sex'
                    }
                }
            };
            var table=tabulator.toHtmlTable(matrix,{pretty:true});
            expect(table.content).to.eql([
                html.caption('Data for zone and area by sex'),
                html.colgroup({'class':'headers'}, [
                    html.col({'class':'zone'}), 
                    html.col({'class':'area'}), 
                ]), 
                html.colgroup({'class':'data'}, [
                    html.col({'class':'{\"age_range\":\"adult\",\"sex\":2}'   }), 
                    html.col({'class':'{\"age_range\":\"adult\",\"sex\":\"masc\"}'}),
                    html.col({'class':'{\"age_range\":\"adult\",\"sex\":\"fem\"}' }),
                    html.col({'class':'{\"age_range\":\"senior\",\"sex\":\"fem\"}' }),
                    html.col({'class':'{\"age_range\":\"senior\",\"sex\":\"masc\"}'})
                ]),
                html.thead([
                    html.tr([
                        html.th({'class':'variable', rowspan:4},'zone'),
                        html.th({'class':'variable', rowspan:4},'area'),
                        html.th({'class':'variable', colspan:5},'Age Range')//colspan=5 porque columns.length=5
                    ]),
                    html.tr([
                        html.th({'class':'var_age_range', colspan:3}, 'Adults 18-59'),
                        html.th({'class':'var_age_range', colspan:2}, 'Senior 60+')
                    ]),
                    html.tr([
                        html.th({'class':'variable', colspan:3}, 'Sex'),
                        html.th({'class':'variable', colspan:2}, 'Sex')
                    ]),
                    html.tr([
                        html.th({'class':'var_sex'}, 2),
                        html.th({'class':'var_sex'}, 'masc'),
                        html.th({'class':'var_sex'}, 'fem'),
                        html.th({'class':'var_sex'}, 'fem'),
                        html.th({'class':'var_sex'}, 'masc'),
                    ])
                ]),
                html.tbody()
            ]);
        });
        it('should render headers for NO column variable #6', function(){
            var matrix={
                caption:"Data for zone and area",
                lineVariables:['zone','area'],
                columnVariables:[],
                columns:[],
                lines:[],
                vars:{
                    zone:{
                        label:'The Zone'
                    }
                },
                oneColumnTitle:'the title for this column'
            };
            var table=tabulator.toHtmlTable(matrix,{pretty:true});
            expect(table.content).to.eql([
                html.caption('Data for zone and area'),
                html.colgroup({'class':'headers'}, [
                    html.col({'class':'zone'}), 
                    html.col({'class':'area'}), 
                ]), 
                html.colgroup({'class':'data'}, [
                    html.col({'class':'variable'}), 
                ]),
                html.thead([
                    html.tr([                        /* si molesta el rowspan:2 sacarlo sino dejarlo */
                        html.th({'class':'variable', rowspan:2},'The Zone'),
                        html.th({'class':'variable', rowspan:2},'area'),
                        html.th({'class':'variable', rowspan:2},'the title for this column')
                    ]),
                ]),
                html.tbody()
            ]);
            matrix.lines=[{
                titles:["one", "two"],
                cells:["three"]
            }];
            // no debe fallar:
            tabulator.toHtmlTable(matrix,{pretty:true});
        });
        it('should render line titles', function(){
            var matrix={
                lineVariables:['number', 'greeks', 'letter'],
                lines:[
                    { titles:['one','alpha','a'], cells:["101"]},
                    { titles:['two','betha','b'], cells:["103"]}
                ],
                vars:{
                    greeks:{
                        label:'Greek',
                        values:{
                            alpha:{label:'α'},
                            betha:{label:'β'}
                        }
                    }
                }
            };
            var html=tabulator.toHtmlTable(matrix);
            var htmlText=html.toHtmlText({pretty:true})
            var i=htmlText.indexOf('  <tbody>');
            expect(htmlText.substr(i)).to.eql(
                "  <tbody>\n"+
                "    <tr>\n"+
                "      <th class=var_number>one</th>\n"+
                "      <th class=var_greeks>α</th>\n"+
                "      <th class=var_letter>a</th>\n"+
                "      <td>101</td>\n"+
                "    </tr>\n"+
                "    <tr>\n"+
                "      <th class=var_number>two</th>\n"+
                "      <th class=var_greeks>β</th>\n"+
                "      <th class=var_letter>b</th>\n"+
                "      <td>103</td>\n"+
                "    </tr>\n"+
                "  </tbody>\n"+
                "</table>\n"
            );
        });
    });
    describe('toHtmlTable controls', function(){
        it('should control the count of variables and header lines', function(){
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
        it('should control the count of variables and column headers', function(){
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
        it('should control the existence of line headers', function(){
            var matrix={
                lineVariables:[],
                lines:[{titles:[], cells:[]}, {cells:[]}]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/there are no titles in line 1 but lineVariables exists/);
        });
        it('should control the existence of title columns', function(){
            var matrix={
                columnVariables:['sex'],
                columns:[{}],
                lines:[]
            };
            expect(function(){
                tabulator.toHtmlTable(matrix);
            }).throwError(/there are no titles in column 0 but columnVariables exists/);
        });
        it('should control the count of cells and columns', function(){
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
        it('should control the existence of cells', function(){
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
