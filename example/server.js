var express = require('express');
var app = express();

var tabulator = require('..');

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

function site_up(req,res){
    res.send("<h1>tabulator demo</h1>");
}

app.get('/index.html',site_up);
app.get('/',site_up);

// app.use(tabulator());

