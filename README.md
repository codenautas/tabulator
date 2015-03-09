# tabulator
Put data into tables

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Code Climate][climate-image]][climate-url]

## Install

```sh
$ npm install tabulator
```

## Example

```js
var Tabulator = require('tabulator').Tabulator;
var tabulator = new Tabulator();

var data=sql.query('SELECT * FROM data');

var matrix=tabulator.toMatrix(data);

res.send(tabulator.toHtmlTable(matrix));
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/tabulator.svg?style=flat
[npm-url]: https://npmjs.org/package/tabulator
[travis-image]: https://img.shields.io/travis/codenautas/tabulator/master.svg?label=linux&style=flat
[travis-url]: https://travis-ci.org/codenautas/tabulator
[appveyor-image]: https://img.shields.io/appveyor/ci/emilioplatzer/tabulator/master.svg?label=windows&style=flat
[appveyor-url]: https://ci.appveyor.com/project/emilioplatzer/tabulator
[coveralls-image]: https://img.shields.io/coveralls/codenautas/tabulator/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/codenautas/tabulator
[downloads-image]: https://img.shields.io/npm/dm/tabulator.svg?style=flat
[downloads-url]: https://npmjs.org/package/tabulator
[climate-image]: https://codeclimate.com/github/codenautas/tabulator/badges/gpa.svg
[climate-url]: https://codeclimate.com/github/codenautas/tabulator