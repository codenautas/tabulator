<!--multilang v0 en:README.md es:LEEME.md -->
# tabulator

Put data into tables

[![version](https://img.shields.io/npm/v/tabulator.svg)](https://npmjs.org/package/tabulator)
[![downloads](https://img.shields.io/npm/dm/tabulator.svg)](https://npmjs.org/package/tabulator)
[![linux](https://img.shields.io/travis/codenautas/tabulator/master.svg)](https://travis-ci.org/codenautas/tabulator)
[![coverage](https://img.shields.io/coveralls/codenautas/tabulator/master.svg)](https://coveralls.io/r/codenautas/tabulator)
[![climate](https://img.shields.io/codeclimate/github/codenautas/tabulator.svg)](https://codeclimate.com/github/codenautas/tabulator)
[![dependencies](https://img.shields.io/david/codenautas/tabulator.svg)](https://david-dm.org/codenautas/tabulator)
<!--multilang buttons -->
language: ![English](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)
also available in:
[![Spanish](https://github.com/codenautas/multilang/blob/master/img/lang-es.png)](LEEME.md)

<!--lang:en-->
## Install

<!--lang:es--]
## Instalación

[!--lang:*-->

```sh
$ npm install tabulator
```

## Example
<!--lang:es--]
## Ejemplo
[!--lang:*-->
```js
var Tabulator = require('tabulator').Tabulator;
var tabulator = new Tabulator();

var data=sql.query('SELECT * FROM data');

var matrix=tabulator.toMatrix(data);

res.send(tabulator.toHtmlTable(matrix));
```
<!--lang:en-->
## License
<!--lang:es--]
## Licencias
-->
[MIT](LICENSE)

[appveyor-image]: https://img.shields.io/appveyor/ci/emilioplatzer/tabulator/master.svg?label=windows&style=flat
[appveyor-url]: https://ci.appveyor.com/project/emilioplatzer/tabulator