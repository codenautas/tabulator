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

console.log('al instalar');

Tabulator.prototype.toHtmlTable = function toHtmlTable(matrix){
    console.log('la matriz', matrix.lines, matrix.lines.map);
    return html.table([html.tbody(matrix.lines.map(function(line){
        console.log('la celda', line.cells, line.cells.map);
        return html.tr(line.cells.map(function(cell){
            return html.td(cell);
        }));
    }))]);
}

Tabulator.prototype.toMatrix = function toMatrix(datum){
    var matrix={lineVariables:[],columnVariables:[], columns:[]};
    for(var i=0; i<datum.vars.length;i++){
        var cadaVar=datum.vars[i];        
        if (cadaVar.place=='left'){
            matrix.lineVariables.push(cadaVar.name);
        }
        if (cadaVar.place=='top'){
            matrix.columnVariables.push(cadaVar.name);
        }
    }
    var vistos=[];
    for(var i=0; i<datum.list.length;i++){
        var cadaList=datum.list[i];
        for(var j=0; j< matrix.columnVariables.length;j++){
            var cadaColumnaTop=matrix.columnVariables[j];                
            if (!vistos[cadaList[cadaColumnaTop]]){
                vistos[cadaList[cadaColumnaTop]]=true;                
                matrix.columns.push({titles:[cadaList[cadaColumnaTop]]});               
            }
        }
    }    
    return matrix;
}

// module system:

Tabulator.newTabulator = function newTabulator(){
    return new Tabulator();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tabulator;
}
})();

