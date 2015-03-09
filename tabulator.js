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

Tabulator.prototype.toHtmlTable = function toHtmlTable(matrix){
    return html.table([html.tbody(matrix.lines.map(function(line){
        return html.tr(line.cells.map(function(cell){
            return html.td(cell);
        }));
    }))]);
}

Tabulator.prototype.toMatrix = function toMatrix(datum){
    var matrix={lineVariables:[],columnVariables:[], dataVariables:[], columns:[], lines:[]};
    for(var i=0; i<datum.vars.length;i++){
        var cadaVar=datum.vars[i];        
        if (cadaVar.place=='left'){
            matrix.lineVariables.push(cadaVar.name);            
        }
        if (cadaVar.place=='top'){
            matrix.columnVariables.push(cadaVar.name);
        }
        if (cadaVar.place=='data'){
            matrix.dataVariables.push(cadaVar.name);
        }        
    }
    var vistosColumnVariables={};
    var vistosLineVariables={};
    for(var i=0; i<datum.list.length;i++){
        var cadaList=datum.list[i];
        for(var j=0; j< matrix.columnVariables.length;j++){
            var cadaNameTop=matrix.columnVariables[j];                
            if (!vistosColumnVariables[cadaList[cadaNameTop]]){
                var iCell=matrix.columns.push({titles:[cadaList[cadaNameTop]]})-1;
                vistosColumnVariables[cadaList[cadaNameTop]]={index: iCell};
            }else{
                var iCell=vistosColumnVariables[cadaList[cadaNameTop]].index;
            }
        }
        var cadaDatoLeft=[];
        var cadaDatoData=[];                
        var mapaDataVariable=[];
    
        for(var j=0; j< matrix.lineVariables.length;j++){
            cadaDatoLeft.push(cadaList[matrix.lineVariables[j]]);
            cadaDatoData.push(cadaList[matrix.dataVariables[j]]);
        }        
        var jsonCadaDatoLeft=JSON.stringify(cadaDatoLeft);
        if (vistosLineVariables[jsonCadaDatoLeft]){
            var iLine=vistosLineVariables[jsonCadaDatoLeft].index;
        }else{
            var iLine=matrix.lines.push({titles:cadaDatoLeft, cells:[]})-1;
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
}

// module system:

/* istanbul ignore else  */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tabulator;
}
})();

