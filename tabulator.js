/*!
 * tabulator
 * 2015 Codenautas
 * GNU Licensed
 */

/**
 * Module dependencies.
 */
"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */
(function webpackUniversalModuleDefinition(root, factory) {
    /* global define */
    /* global globalModuleName */
    if(typeof root.globalModuleName !== 'string'){
        root.globalModuleName = factory.name;
    }
    /* istanbul ignore next */
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define(factory);
    else if(typeof exports === 'object')
        exports[root.globalModuleName] = factory();
    else
        root[root.globalModuleName] = factory();
    root.globalModuleName = null;
})(/*jshint -W040 */this, function Tabulator() {
/*jshint +W040 */
    
var _=require('lodash');
var html=require('js-to-html').html;




/*jshint -W004 */
var Tabulator = function(){
};
/*jshint +W004 */
 
 // import used by this file
// var dependency = dependency || require('dependency');  

function array_combine(keys, values) {
  var new_array = {};
  for (var i = 0; i < keys.length; i++) {
    new_array[keys[i]] = values[i];
  }
  return new_array;
}



Tabulator.prototype.captionPart = function captionPart(matrix){
    return matrix.caption?html.caption(matrix.caption):null;
};

Tabulator.prototype.colGroups = function colGroups(matrix){
    var lineVariablesPart= matrix.lineVariables? html.colgroup({'class':'headers'},matrix.lineVariables.map(function(lineVariable){
        return html.col({'class':lineVariable});})):null;
    var columnVariablesPart=(matrix.columns)? html.colgroup({'class':'data'},matrix.columns.map(function(column){
        return html.col({'class':JSON.stringify(array_combine(matrix.columnVariables,column.titles))});})):null; 
    return [].concat(lineVariablesPart,columnVariablesPart);
};

Tabulator.prototype.tHeadPart = function tHeadPart(matrix){
    if(!matrix.columnVariables) return null;
    function labelVariable(varName){
        return ((matrix.vars||{})[varName]||{}).label||varName;
    }
    function labelVariableValues(varName,varValue){
        return (((((matrix.vars||{})[varName]||{}).values)||{})[varValue]||{}).label||varValue;
    }
    return html.thead(
        [
            html.tr(
                matrix.lineVariables.map(function(varName){
                    //matrix.vars[varName].label === undefined ? varName: matrix.vars[varName].label
                    //return html.th({'class':'variable', 'rowspan':2*matrix.columnVariables.length},varName);
                    return html.th({'class':'variable', 'rowspan':2*matrix.columnVariables.length}, labelVariable(varName));
                }).concat(
                    html.th({'class':'variable', colspan:matrix.columns.length},labelVariable(matrix.columnVariables[0]))
                )
            )
        ].concat(_.flatten(matrix.columnVariables.map(function(columnVariable,iColumnVariable){
            var lineTitles=[];
            var lineVariables=[];
            var previousValuesUptoThisRowJson="none";
            var colspan=1;
            function updateColspan(){
                if(colspan>1){
                    titleCellAttrs.colspan=colspan;
                    variableCellAttrs.colspan=colspan;
                }
            }
            for(var i=0; i<matrix.columns.length; i++){
                var actualValues=matrix.columns[i].titles;
                var actualValuesUptoThisRow=actualValues.slice(0,iColumnVariable+1);
                //console.log("actualValuesUptoThisRow" + actualValuesUptoThisRow);
                var actualValuesUptoThisRowJson=JSON.stringify(actualValuesUptoThisRow);
                if(actualValuesUptoThisRowJson!=previousValuesUptoThisRowJson){
                    updateColspan();
                    var titleCellAttrs={'class':'var_'+matrix.columnVariables[iColumnVariable]};
                    //console.log(iColumnVariable + '     ' + JSON.stringify(actualValues[iColumnVariable]));
                    //console.log(labelVariableValues(matrix.columnVariables[iColumnVariable],actualValues[iColumnVariable]));
                    var varName = matrix.columnVariables[iColumnVariable];
                    var varValue = actualValues[iColumnVariable];
                    lineTitles.push(html.th(titleCellAttrs, labelVariableValues(varName,varValue)));
                    if(iColumnVariable+1<matrix.columnVariables.length){
                        var variableCellAttrs={'class':'variable'};
                        lineVariables.push(html.th(variableCellAttrs, labelVariable(matrix.columnVariables[iColumnVariable+1])));
                        //var varName=matrix.columnVariables[iColumnVariable+1];
                        //console.log("iColumnVariable: " + iColumnVariable);
                        //console.log(matrix.columnVariables[iColumnVariable+1]);
                        //console.log("Elemento que pushea en lineVariables: " + JSON.stringify(html.th(variableCellAttrs, matrix.columnVariables[iColumnVariable+1])));
                        //lineVariables.push(html.th(variableCellAttrs, 
                        //matrix.vars===undefined||matrix.vars[varName]===undefined||matrix.vars[varName].label===undefined?matrix.vars[varName].label:varName));
                    }
                    previousValuesUptoThisRowJson=actualValuesUptoThisRowJson;
                    colspan=0;
                }
                colspan++;
            }
            updateColspan();
            if(iColumnVariable+1<matrix.columnVariables.length){
                return [html.tr(lineTitles), html.tr(lineVariables)];
            }else{
                return [html.tr(lineTitles)];
            }
        }))
    ));
};


Tabulator.prototype.defaultShowAttribute='show';

Tabulator.prototype.toLeftCellTable=function(cell){
    return html.th(cell,cell instanceof Object?cell[this.defaultShowAttribute]:null);
};

Tabulator.prototype.toCellTable=function(cell){
    return html.td(cell,cell instanceof Object?cell[this.defaultShowAttribute]:null);
};

Tabulator.prototype.tBodyPart = function tBodyPart(matrix){
    var trList=[];
    var previousLineTitles=[];
    var titleLineAttrs=[];    
    var colspans=[];    
    if(matrix.lines && matrix.lines[0] && matrix.lines[0].titles){
        for(var iLines=0;iLines<matrix.lines[0].titles.length;iLines++){
            colspans[iLines]=0;
        }
    }
    for(var i=0; i<matrix.lines.length;i++){
        var actualLine=matrix.lines[i];
        var actualLineTitles=actualLine.titles;
        var thListActualLine=[];
        var actualLineCells=matrix.lines[i].cells;
        var td=actualLineCells.map(function(cell){
            return (this.toCellTable(cell));
        },this);
        if(actualLineTitles){
            for(var j=0;j<actualLineTitles.length;j++){
                var actualLineTitlesUpToNow=actualLineTitles.slice(0,j+1);
                var previousLineTitlesUpToNow=previousLineTitles.slice(0,j+1);
                colspans[j]++;
                if(colspans[j]>1){
                    titleLineAttrs[j].colspan=colspans[j];
                }
                if(JSON.stringify(actualLineTitlesUpToNow)!=JSON.stringify(previousLineTitlesUpToNow)){
                    colspans[j]=0;
                    titleLineAttrs[j]={};
                    thListActualLine.push(html.th(titleLineAttrs[j],actualLineTitles[j]));
                }
            }
            previousLineTitles=actualLineTitles;
        }
        trList.push(html.tr(thListActualLine.concat(td)));
    }
    return html.tbody(trList);
};
     


Tabulator.prototype.toHtmlTable = function toHtmlTable(matrix){
    this.controls(matrix);
    return html.table([].concat(
        this.captionPart(matrix),
        this.colGroups(matrix),
        this.tHeadPart(matrix),
        this.tBodyPart(matrix)
    ));
};

Tabulator.prototype.controls=function controls(matrix){
    var  matrixLineVariables=matrix.lineVariables;
    var  matrixLines=matrix.lines;
    var  matrixColumnVariables=matrix.columnVariables;
    var  matrixColumns=matrix.columns;
    if(matrixColumnVariables && matrixColumns){
        variableExistanceAndQuantity(matrixColumnVariables,matrixColumns,'columnVariables');
    }
    if(matrixLineVariables && matrixLines){
        variableExistanceAndQuantity(matrixLineVariables,matrixLines,'lineVariables');
    }
    if(matrixColumns && matrixLines){
        cellExistanceAndQuantity(matrixColumns,matrixLines,'cells');
    }
    function variableExistanceAndQuantity(arrVar,objVar,nameArrVar){
        var varName=nameArrVar=='columnVariables'?'column ':'line ';
        var variablesQuantity=arrVar.length;
        for(var i=0;i<objVar.length;i++){
            if(objVar[i].titles){
                if(objVar[i].titles.length!=variablesQuantity){
                    throw new Error(varName+i+' has '+objVar[i].titles.length+' values but '+nameArrVar+' has '+variablesQuantity);
                }
            }else{
                throw new Error('there are no titles in '+ varName +i+' but '+nameArrVar+ ' exists');
            }
        }
    }
 
    function cellExistanceAndQuantity(matrixColumns,matrixLines,varName){
        var columnQuantity=matrixColumns.length;
        for(var i=0;i<matrixLines.length;i++){
            if(matrixLines[i].cells.length>0){
                if(matrixLines[i].cells.length!=columnQuantity){
                    throw new Error('line '+i+' has '+matrixLines[i].cells.length+' cells but columns has '+columnQuantity);
                }
            }else{
                throw new Error('there are no cells in line '+i+' but columns exists'); 
            }
        }
    }
};



Tabulator.prototype.toMatrix = function toMatrix(datum){
    var places={
        left:{place:'lineVariables'},
        top:{place:'columnVariables'},
        data:{place:'dataVariables'},
    };
    var matrix={lineVariables:[],columnVariables:[], dataVariables:[], columns:[], lines:[], vars:[]};
    for(var i=0; i<datum.vars.length;i++){
        var cadaVar=datum.vars[i];
        matrix[places[cadaVar.place].place].push(cadaVar.name);
        matrix.vars[cadaVar.name] = cadaVar;
    }
    var vistosColumnVariables={};
    var vistosLineVariables={};
    for(var iList=0; iList<datum.list.length; iList++){
        var iCell;
        var iLine;
        var cadaList=datum.list[iList];
        for(var iColumn=0; iColumn<matrix.columnVariables.length;iColumn++){
            var cadaNameTop=matrix.columnVariables[iColumn];                
            if (!vistosColumnVariables[cadaList[cadaNameTop]]){
                iCell=matrix.columns.push({titles:[cadaList[cadaNameTop]]})-1;
                vistosColumnVariables[cadaList[cadaNameTop]]={index: iCell};
            }else{
                iCell=vistosColumnVariables[cadaList[cadaNameTop]].index;
            }
        }
        var cadaDatoLeft=[];
        var cadaDatoData=[];                
        for(var j=0; j<matrix.lineVariables.length;j++){
            cadaDatoLeft.push(cadaList[matrix.lineVariables[j]]);
            cadaDatoData.push(cadaList[matrix.dataVariables[j]]);
        }        
        var jsonCadaDatoLeft=JSON.stringify(cadaDatoLeft);
        if (vistosLineVariables[jsonCadaDatoLeft]){
            iLine=vistosLineVariables[jsonCadaDatoLeft].index;
        }else{
            iLine=matrix.lines.push({titles:cadaDatoLeft, cells:[]})-1;
            vistosLineVariables[jsonCadaDatoLeft]={index: iLine};            
        }
        var newCell={};
        if(datum.showFunction){
            newCell.display=datum.showFunction(cadaList);
        }
        for(var k=0; k<matrix.dataVariables.length; k++){
            var nombreVariable=matrix.dataVariables[k];
            newCell[nombreVariable]=cadaList[nombreVariable];
        }
        matrix.lines[iLine].cells[iCell]=newCell;
    }
    for(var l=0; l<matrix.lines.length; l++){
        for(var m=0; m<matrix.columns.length; m++){
            if (matrix.lines[l].cells[m]===undefined){
                matrix.lines[l].cells[m]=null;
            }
        }
    }
    return matrix;
};

return Tabulator;

});