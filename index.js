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

Tabulator.prototype.toHtmlTd = function toHtmlTd(obj){
    return 'NOT IMPLEMENTED YET(1)!';
}

Tabulator.prototype.toHtmlTable = function toHtmlTable(matrix,opts){
    return 'NOT IMPLEMENTED YET(2)!';
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

