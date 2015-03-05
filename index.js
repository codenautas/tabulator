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
    var lineVariablesJSON=JSON.stringify(matrix.lineVariables);
    
    var vistosColumnVariables=[];
    var vistosLineVariables=[];
    
    for(var i=0; i<datum.list.length;i++){
        var cadaList=datum.list[i];
        for(var j=0; j< matrix.columnVariables.length;j++){
            var cadaNameTop=matrix.columnVariables[j];                
            if (!vistosColumnVariables[cadaList[cadaNameTop]]){
                vistosColumnVariables[cadaList[cadaNameTop]]=true;                
                matrix.columns.push({titles:[cadaList[cadaNameTop]]});               
            }
        }
        var cadaDatoLeft=[];
        var cadaDatoData=[];        
        for(var j=0; j< matrix.lineVariables.length;j++){
            cadaDatoLeft.push(cadaList[matrix.lineVariables[j]]);            
            cadaDatoData.push(cadaList[matrix.dataVariables[j]]);
        }
        if (!vistosLineVariables[cadaDatoLeft]){
            vistosLineVariables[cadaDatoLeft]=true;
            matrix.lines.push({titles:cadaDatoLeft});
            //var cadaDatoDeLaLista
            for(var k=0; k<datum.list.length;k++){
                
            /*
                for(var m=0; m<cadaDatoLeft.length;m++){
                    if(cadaDatoLeft[m]==datum.list[k]){
                        matrix.lines.push({cells:cadaDatoData});                        
                    }
                }
            */
            }
            
        }
        //matrix.lines.push({cells:cadaDatoData});
        
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

