
var expect = require('expect.js');

var Tabulator = require('../tabulator.js');

describe('tabulator', function(){
    var tabulator;
    beforeEach(function(){
        tabulator=new Tabulator();
    });
    describe('toMatrix with datum to produce a 3x3 incomplete matrix', function(){
        var datum;
        beforeEach(function(){
            datum={
                list:[
                    {zone:'totalZ', area:'total,A',sex:'both', number:19000,total:19000},
                    {zone:'totalZ', area:'total,A',sex:'masc', number:9880, total:19000},
                    {zone:'zone 1', area:'area 1', sex:'masc', number:5110, total:10000},
                    {zone:'zone 1', area:'area 2', sex:'fem' , number:4365, total: 9000},
                    {zone:'zone 1', area:'area 1', sex:'fem' , number:4890, total:10000},
                    {zone:'zone 1', area:'area 2', sex:'masc', number:4635, total: 9000},
                    {zone:'zone 1', area:'area 2', sex:'both' ,number:9000, total: 9000}
                ],
                vars:[
                    {name: 'zone'  , place: 'left'},
                    {name: 'area'  , place: 'left'},
                    {name: 'sex'   , place: 'top' },
                    {name: 'number', place: 'data', another_data:{all:true}},
                    {name: 'total' , place: 'data'}
                ],
                showFunction:function(data){
                    return data.number/data.total*100
                }
            };
        });
        it('shoud obtain the variables',function(){
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.lineVariables).to.eql(['zone','area']);
            expect(obtain.columnVariables).to.eql(['sex']);
            expect(obtain.vars).not.to.be.an(Array);
        });
        it('shoud obtain the data for the column titles',function(){
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.columns).to.eql([
                {titles:['both']},
                {titles:['masc']},
                {titles:['fem' ]}
            ]);
        });
        it('shoud obtain the data and the titles of each line',function(){
            var countCall2toCell=0;
            tabulator.toCell=function(row){
                countCall2toCell++;
                return {display:row.number/row.total, numerator:row.number, denominator:row.total};
            }
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.lines).to.eql([
                {
                    titles:['totalZ', 'total,A'],
                    cells:[
                        {display:100  , number:19000,total:19000},
                        {display:52   , number: 9880,total:19000},
                        null
                    ]
                },{
                    titles:['zone 1', 'area 1'],
                    cells:[
                        null,
                        {display:51.1 , number:5110, total:10000},
                        {display:48.9 , number:4890, total:10000}
                    ]
                },{
                    titles:['zone 1', 'area 2'],
                    cells:[
                        {display:100  , number:9000, total: 9000},
                        {display:51.5 , number:4635, total: 9000},
                        {display:48.5 , number:4365, total: 9000}
                    ]
                }
            ]);
        });
        it('shoud obtain vars #1',function(){
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.vars).to.eql({
                zone  :{name: 'zone'  , place: 'left'},
                area  :{name: 'area'  , place: 'left'},
                sex   :{name: 'sex'   , place: 'top' },
                number:{name: 'number', place: 'data', another_data:{all:true}},
                total :{name: 'total' , place: 'data'}
            });
        });
        it('shoud obtain cells without showFunction',function(){
            delete datum.showFunction;
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.lines[0].cells[0]).to.eql(
                {number:19000,total:19000}
            );
        });
        it('should obtain the titles with more than one column',function(){
            var datum2=datum;
            datum2.vars=datum2.vars.map(function(varElem,i){
                varElem.place= varElem.place=='left'?'top':(varElem.place=='top'?'left':varElem.place);
                return varElem;
            }); 
            var obtain=tabulator.toMatrix(datum2);
            expect(obtain.columns).to.eql([
                {titles:['totalZ', 'total,A']},
                {titles:['zone 1', 'area 1']},
                {titles:['zone 1', 'area 2']}
            ]);
        });
    });
    describe('toMatrix with datum to produce 1d matrix (with no top variable) #5', function(){
        var datum;
        beforeEach(function(){
            datum={
                list:[
                    {zone:'totalZ', area:'total,A', number:19000,total:19000},
                    {zone:'zone 1', area:'area 1',  number:5110, total:10000},
                    {zone:'zone 1', area:'area 2',  number:4365, total: 9000}
                ],
                vars:[
                    {name: 'zone'  , place: 'left'},
                    {name: 'area'  , place: 'left'},
                    {name: 'number', place: 'data', another_data:{all:true}},
                    {name: 'total' , place: 'data'}
                ],
                showFunction:function(data){
                    return data.number/data.total*100
                },
                oneColumnTitle:'the unique title'
            };
        });
        it('shoud obtain the variables',function(){
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.lineVariables).to.eql(['zone','area']);
            expect(obtain.columnVariables).to.eql([]);
            expect(obtain.oneColumnTitle).to.eql('the unique title');
        });
        it('shoud obtain the data for the column titles',function(){
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.columns).to.eql([]);
        });
        it('shoud obtain the data and the titles of each line',function(){
            var countCall2toCell=0;
            tabulator.toCell=function(row){
                countCall2toCell++;
                return {display:row.number/row.total, numerator:row.number, denominator:row.total};
            }
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.lines).to.eql([
                {
                    titles:['totalZ', 'total,A'],
                    cells:[
                        {display:100  , number:19000,total:19000},
                    ]
                },{
                    titles:['zone 1', 'area 1'],
                    cells:[
                        {display:51.1 , number:5110, total:10000},
                    ]
                },{
                    titles:['zone 1', 'area 2'],
                    cells:[
                        {display:48.5 , number:4365, total: 9000}
                    ]
                }
            ]);
        });
        it('shoud obtain vars #1',function(){
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.vars).to.eql({
                zone  :{name: 'zone'  , place: 'left'},
                area  :{name: 'area'  , place: 'left'},
                number:{name: 'number', place: 'data', another_data:{all:true}},
                total :{name: 'total' , place: 'data'}
            });
        });
        it('shoud obtain cells without showFunction',function(){
            delete datum.showFunction;
            var obtain=tabulator.toMatrix(datum);
            expect(obtain.lines[0].cells[0]).to.eql(
                {number:19000,total:19000}
            );
        });
    })
});
