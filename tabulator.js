/*!
 * tabulator
 * 2015 Codenautas
 * GNU Licensed
 */

/**
 * Module dependencies.
 */

var html=require('js-to-html').html;
 
 // import used by this file
// var dependency = dependency || require('dependency');  

var Tabulator = function(){
};

(function(){

Tabulator.prototype.captionPart = function toHtmlTable(matrix){
    return matrix.caption?html.caption(matrix.caption):null;
}

Tabulator.prototype.colGroups = function colGroups(matrix){
    var lineVariablesPart= matrix.lineVariables? html.colgroup({'class':'headers'},matrix.lineVariables.map(function(lineVariable){
        return html.col({'class':lineVariable})})):null;
    var columnVariablesPart=(matrix.columns)? html.colgroup({'class':'data'},matrix.columns.map(function(column){
        return html.col({'class':'{\"'+matrix.columnVariables+'\":\"'+column.titles[0]+'\"}'}) })):null;
    //console.log( 'lvp '+lineVariablesPart.join(',' ));  
    //console.log( 'cvp '+columnVariablesPart.join(','));  
    return [].concat(lineVariablesPart,columnVariablesPart);
}

Tabulator.prototype.tHeadPart = function tHeadPart(matrix){
    // {"class":"headers"}
    return null;
}

Tabulator.prototype.defaultShowAttribute='show';

Tabulator.prototype.toCellTable=function(cell){
    return html.td(cell,cell instanceof Object?cell[this.defaultShowAttribute]:null);
}

Tabulator.prototype.tBodyPart = function tBodyPart(matrix){
    return html.tbody(matrix.lines.map(function(line){
        return html.tr(line.cells.map(function(cell){
            return this.toCellTable(cell);
        },this));
    },this));
}

Tabulator.prototype.toHtmlTable = function toHtmlTable(matrix){
    return html.table([].concat(
        this.captionPart(matrix),
        this.colGroups(matrix),
        this.tHeadPart(matrix),
        this.tBodyPart(matrix)
    ));
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