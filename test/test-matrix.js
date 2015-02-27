﻿
var expect = require('expect.js');

var Tabulator = require('..');

describe('tabulator', function(){
    var tabulator;
    beforeEach(function(){
        tabulator=new Tabulator();
    });
    describe('toMatrix', function(){
        it/*.skip*/('shoud matrix a list with three header variables and 1 data variable and with holes',function(){
            var countCall2toCell=0;
            var datum={
                list:[
                    {zone:'totalZ', area:'totalA', sex:'both', number:19000,total:19000},
                    {zone:'totalZ', area:'totalA', sex:'masc', number:9745, total:19000},
                    {zone:'zone 1', area:'area 1', sex:'masc', number:5110, total:10000},
                    {zone:'zone 1', area:'area 1', sex:'fem' , number:4890, total:10000},
                    {zone:'zone 1', area:'area 2', sex:'fem' , number:4365, total: 9000},
                    {zone:'zone 1', area:'area 2', sex:'masc', number:4635, total: 9000},
                    {zone:'zone 1', area:'area 2', sex:'both' ,number:9000, total: 9000}
                ],
                vars:[
                    {name: 'zone'  , place: 'left'},
                    {name: 'area'  , place: 'left'},
                    {name: 'sex'   , place: 'top' },
                    {name: 'number', place: 'data'},
                    {name: 'total' , place: 'data'}
                ],
                showFunction:function(data){
                    return data.number/total.number*100
                }
            };
            tabulator.toCell=function(row){
                countCall2toCell++;
                return {display:row.number/row.total, numerator:row.number, denominator:row.total};
            }
            var matrix={
                lineVariables:['zone','area'],
                columnVariables:['sex'],
                columns:[
                    {titles:['both']},
                    {titles:['masc']},
                    {titles:['fem' ]}
                ],
                lines:[{
                    titles:['totalZ', 'totalA'],
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
                }]
            };
            var obtain=tabulator.toMatrix(datum);
            expect(obtain).to.eql(matrix);
        });
    })
});