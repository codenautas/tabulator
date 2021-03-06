"use strict";

var Tabulator = require('tabulator');
var tabulator = new Tabulator();
tabulator.defaultShowAttribute='valor';

var datum = {
    vars:[
        {name:'comuna', place:'left'},
        {name:'año'   , place:'top' },
        {name:'valor' , place:'data'},
    ],
    list:[
        {comuna: 1, año: 2015, valor:1230},
        {comuna: 2, año: 2015, valor:1430},
        {comuna: 3, año: 2015, valor:1980},
        {comuna: 4, año: 2015, valor:1520},
        {comuna: 1, año: 2016, valor:2230},
        {comuna: 2, año: 2016, valor:2330},
        {comuna: 3, año: 2016, valor:2280},
        {comuna: 4, año: 2016, valor:2620},
        {comuna: 1, año: 2017, valor:2730},
        {comuna: 2, año: 2017, valor:2830},
        {comuna: 3, año: 2017, valor:2780},
        {comuna: 4, año: 2017, valor:2920},
    ]
}

var matrix = tabulator.toMatrix(datum);

console.log(matrix);

var table = tabulator.toHtmlTable(matrix);

canvasTable.innerHTML="";
var createdTable = canvasTable.appendChild(table.create());

//export to excel button
var exportButton = document.createElement('input');
exportButton.type='button';
exportButton.value='export to excel';
exportButton.onclick = function(){
    tabulator.toExcel(createdTable, 'ejemplo');
};
canvasTable.appendChild(exportButton);