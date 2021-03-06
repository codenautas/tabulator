"use strict";

var expect = require('expect.js');
var expectCalled = require('expect-called');

var Tabulator = require('../tabulator.js');

describe('tabulator', function(){
    var tabulator;
    beforeEach(function(){
        tabulator=new Tabulator();
    });
    describe('matrixJoin', function(){
        it('should render line titles', function(){
            var matrix1={
                caption:"Data for zone and area by sex",
                columnVariables:['code'],
                columns:[
                    {titles:['unique']}
                ],
                lineVariables:['number', 'greeks', 'letter'],
                lines:[
                    { titles:['one','alpha','a'], cells:["101"]},
                    { titles:['two','betha','b'], cells:["103"]}
                ],
                vars:{
                    greeks:{
                        label:'Greek',
                        values:{
                            alpha:{label:'a'},
                            betha:{label:'�'}
                        }
                    },
                    unique:{
                        label:'Unique',
                    }
                }
            };
            var matrix2={
                caption:"Other caption",
                columnVariables:['sex'],
                columns:[
                    {titles:['masc']},
                    {titles:['fem']}
                ],
                lineVariables:['number', 'greeks', 'letter'],
                lines:[
                    { titles:['one','alpha','a'], cells:[1,2]},
                    { titles:['two','betha','b'], cells:[3,4]}
                ],
                vars:{
                }
            };
            var matrix3={
                caption:"Data for zone and area by sex",
                columnVariables:['sex','age'],
                columns:[
                    {titles:['masc','kid']},
                    {titles:['masc','senior']},
                    {titles:['fem','kid']},
                    {titles:['fem','senior']}
                ],
                lineVariables:['number', 'greeks', 'letter'],
                lines:[
                    { titles:['two','betha','b'], cells:[15,16,17,18]},
                    { titles:['one','alpha','a'], cells:[11,12,13,14]}
                ],
                vars:{
                    age:{
                        label:'Age group',
                        values:{
                            kid:{label:'0-17'},
                            senior:{label:'17+'}
                        }
                    }
                }
            };
            var joined=tabulator.matrixJoin([matrix1,matrix2,matrix3]);
            expect(joined).to.eql({
                caption:[matrix1.caption, matrix2.caption, matrix3.caption].join(tabulator.matrixJoin.captionSeparator),
                columnGroups:[{
                    //columnVariables:['sex','age'],
                    columnVariables:['code'],
                    columns:[
                        {titles:['unique']}
                    ],
                },{
                    columnVariables:['sex'],
                    columns:[
                        {titles:['masc']},
                        {titles:['fem']}
                    ],
                },{
                    columnVariables:['sex','age'],
                    columns:[
                        {titles:['masc','kid']},
                        {titles:['masc','senior']},
                        {titles:['fem','kid']},
                        {titles:['fem','senior']}
                    ],
                }],
                lineVariables:['number', 'greeks', 'letter'],
                lines:[
                    { titles:['one','alpha','a'], cells:["101",1,2,11,12,13,14]},
                    { titles:['two','betha','b'], cells:["103",3,4,15,16,17,18]}
                ],
                vars:{
                    greeks:{
                        label:'Greek',
                        values:{
                            alpha:{label:'a'},
                            betha:{label:'�'}
                        }
                    },
                    unique:{
                        label:'Unique',
                    },
                    age:{
                        label:'Age group',
                        values:{
                            kid:{label:'0-17'},
                            senior:{label:'17+'}
                        }
                    }
                }
            });
        });
    });
    describe('matrixJoin controls', function(){
        it('should control lenght of all lines', function(){
            var matrix1={
                lines:[1,2,3]
            }
            var matrix2={
                lines:[1,2,3]
            }
            var matrix3={
                lines:[1,2]
            }
            expect(function(){
                tabulator.matrixJoin([matrix1, matrix2, matrix3]);
            }).throwError(/line.length does not match in all matrix/);
        });
        it('sould control titles matchs', function(){
            var matrix1={
                lines:[
                    { titles:['one','alpha','a'], cells:["101",1,2,11,12,13,14]},
                    { titles:['two','betha','b'], cells:["103",3,4,15,16,17,18]}
                ]
            }
            var matrix2={
                lines:[
                    { titles:['one','alpha','a'], cells:["101",1,2,11,12,13,14]},
                    { titles:['two','betha','x'], cells:["103",3,4,15,16,17,18]}
                ]
            }
            var matrix3={
                lines:[
                    { titles:['one','alpha','a'], cells:["101",1,2,11,12,13,14]},
                    { titles:['two','betha','b'], cells:["103",3,4,15,16,17,18]}
                ]
            }
            expect(function(){
                tabulator.matrixJoin([matrix1, matrix2, matrix3]);
            }).throwError(/line titles does not match in all matrix/);
        });
    });
});
