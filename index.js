/*!
 * tabulator
 * 2015 Codenautas
 * GNU Licensed
 */

/**
 * Module dependencies.
 */
// import used by this file
// var dependency = dependency || require('dependency');  

var Tabulator = function(){
};

(function(){

console.log('al instalar');

Tabulator.prototype.cellator = function cellator(obj){
    return 'NOT IMPLEMENTED YET(1)!';
}

Tabulator.prototype.toHtmlTable = function toHtmlTable(matrix,opts){
    return '<table>\n'+
        '  <tbody>\n'+ 
        matrix.lines.map(function(lineas){
            return '    <tr>'+'\n' +
                lineas.cells.map(function(celdas){
                    return '      <td>'+celdas+'</td>'+'\n';
                }).join('')+
                '    </tr>'+'\n';
        }).join('')+'  </tbody>'+'\n'+'</table>'+'\n';
}

Tabulator.prototype.toMatrix = function toMatrix(datum){
    return 'not implemented yet (3)!';
}

// module system:

Tabulator.newTabulator = function newTabulator(){
    return new Tabulator();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tabulator;
}
})();

