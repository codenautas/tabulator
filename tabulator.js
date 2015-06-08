"use strict";
/*!
 * tabulator
 * 2015 Codenautas
 * GNU Licensed
 */

/**
 * Module dependencies.
 */

var _=require('lodash');
var html=require('js-to-html').html;
 
 // import used by this file
// var dependency = dependency || require('dependency');  

function array_combine(keys, values) {
  var new_array = {};
  for (var i = 0; i < keys.length; i++) {
    new_array[keys[i]] = values[i];
  }
  return new_array;
}

var Tabulator = function(){
};

(function(){

Tabulator.prototype.captionPart = function captionPart(matrix){
    return matrix.caption?html.caption(matrix.caption):null;
}

Tabulator.prototype.colGroups = function colGroups(matrix){
    var lineVariablesPart= matrix.lineVariables? html.colgroup({'class':'headers'},matrix.lineVariables.map(function(lineVariable){
        return html.col({'class':lineVariable})})):null;
    var columnVariablesPart=(matrix.columns)? html.colgroup({'class':'data'},matrix.columns.map(function(column){
        return html.col({'class':JSON.stringify(array_combine(matrix.columnVariables,column.titles))}) })):null; 
    return [].concat(lineVariablesPart,columnVariablesPart);
}

Tabulator.prototype.tHeadPart = function tHeadPart(matrix){
    if(!matrix.columnVariables) return null;
    return html.thead(
        [
            html.tr(
                matrix.lineVariables.map(function(varName){
                    return html.th({'class':'variable', 'rowspan':2*matrix.columnVariables.length},varName);
                }).concat(
                    html.th({'class':'variable', colspan:matrix.columns.length},matrix.columnVariables[0])
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
                var actualValuesUptoThisRowJson=JSON.stringify(actualValuesUptoThisRow);
                if(actualValuesUptoThisRowJson!=previousValuesUptoThisRowJson){
                    updateColspan();
                    var titleCellAttrs={'class':'var_'+matrix.columnVariables[iColumnVariable]};
                    lineTitles.push(html.th(titleCellAttrs, actualValues[iColumnVariable]));
                    if(iColumnVariable+1<matrix.columnVariables.length){
                        var variableCellAttrs={'class':'variable'};
                        lineVariables.push(html.th(variableCellAttrs, matrix.columnVariables[iColumnVariable+1]))
                    }
                    previousValuesUptoThisRowJson=actualValuesUptoThisRowJson;
                    colspan=0;
                };
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
}


Tabulator.prototype.defaultShowAttribute='show';

Tabulator.prototype.toLeftCellTable=function(cell){
    return html.th(cell,cell instanceof Object?cell[this.defaultShowAttribute]:null);
}

Tabulator.prototype.toCellTable=function(cell){
    return html.td(cell,cell instanceof Object?cell[this.defaultShowAttribute]:null);
}

Tabulator.prototype.tBodyPart = function tBodyPart(matrix){
    var trList=[];
    var previousLineTitles=[];
    var titleLineAttrs=[];    
    var colspans=[];    
    if(matrix.lines && matrix.lines[0] && matrix.lines[0].titles){
        for(var j=0;j<matrix.lines[0].titles.length;j++){
            colspans[j]=0;
        }
    }
    for(var i=0; i<matrix.lines.length;i++){
        var actualLine=matrix.lines[i]
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
                colspans[j]++
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
    return html.tbody(trList)
}
     


Tabulator.prototype.toHtmlTable = function toHtmlTable(matrix){
    this.controls(matrix);
    return html.table([].concat(
        this.captionPart(matrix),
        this.colGroups(matrix),
        this.tHeadPart(matrix),
        this.tBodyPart(matrix)
    ));
}

Tabulator.prototype.controls=function controls(matrix){

    var  matrixLineVariables=matrix.lineVariables;
    var  matrixLines=matrix.lines;
    var  matrixColumnVariables=matrix.columnVariables;
    var  matrixColumns=matrix.columns;

    if(matrixLineVariables){
        if(matrixLines){
            
            quantityLineVariables(matrixLineVariables,matrixLines,'lineVariables')
        }
    }
    if(matrixColumnVariables){
        if(matrixColumns){
            if(matrixColumns[0].titles!=null){
                quantityLineVariables(matrixColumnVariables,matrixColumns,'columnVariables');
            }else{
                throw new Error('there are no titles in column 0 but columnVariables exists'+'/line 2 has 1 cells but columns has 3/');
            }
        }
    }
    function quantityLineVariables(arrVar,objVar,nameArrVar){
        var variablesQuantity=arrVar.length;
        for(var i=0;i<objVar.length;i++){
            if(objVar[i].titles.length!=variablesQuantity){
                var string='Line '+i+' has '+objVar[i].titles.length+' values but '+ nameArrVar+' has '+variablesQuantity;
                throw new Error(string+ 'line 2 has 3 values but lineVariables has 2'+'column 1 has 0 values but columnVariables has 1');
            }
        }   
    };

    function quantityOfCells(matrix){
        if(matrix.columns){
            if(matrix.lines){
                for(var i=0;i<matrix.lines.length;i++){
                    if(matrix.lines[i].cells.length!=matrix.columns.length){
                        throw new Error('line 2 has 1 cells but columns has 3');
                    }
                }
            }
        }
    }
    quantityOfCells(matrix)
    
}



Tabulator.prototype.toMatrix = function toMatrix(datum){
    var places={
        left:{place:'lineVariables'},
        top:{place:'columnVariables'},
        data:{place:'dataVariables'},
    };
    var matrix={lineVariables:[],columnVariables:[], dataVariables:[], columns:[], lines:[]};
    for(var i=0; i<datum.vars.length;i++){
        var cadaVar=datum.vars[i];
        matrix[places[cadaVar.place].place].push(cadaVar.name);
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

// module system:

/* istanbul ignore else  */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tabulator;
}
})();
