﻿var express = require('express');
var app = express();

var Path = require('path');

var serveContent = require('serve-content');

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

function site_up(req,res){
    res.send(`
        <link rel="shortcut icon" href="tabulator-ico.png" type="image/png" />
        <h1>tabulator demo</h1>
        <div id=canvasTable>loading...</div>
        <script src='FileSaver.min.js'></script>
        <script src='dist/xlsx.full.min.js'></script>
        <script src='best-globals.js'></script>
        <script src='like-ar.js'></script>
        <script src='js-to-html.js'></script>
        <script src='require-bro.js'></script>
        <script src='tabulator.js'></script>
        <script src='tabulator-example.js'></script>
    `);
}

[
    'node_modules/file-saver',
    'node_modules/codenautas-xlsx',
    'node_modules/best-globals',
    'node_modules/like-ar',
    'node_modules/js-to-html',
    'node_modules/require-bro/lib',
    'example',
    ''
].forEach(function(jsPath){
    console.log('colgando ', './'+jsPath, Path.resolve('./'+jsPath));
    app.use('/', serveContent('./'+jsPath, {allowedExts:'js'}));
});

app.use('/example', serveContent('./', {allowedExts:['png', 'jpg', 'jpeg','css']}));

app.get('/index.html',site_up);
app.get('/',site_up);

// app.use(tabulator());

