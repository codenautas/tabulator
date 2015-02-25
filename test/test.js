
var assert = require('assert');
var tabulator = require('..');

describe('tabulator', function(){
    var internalCounter;

    describe('basic test', function(){
        it('first test', function(){
            throw new Error('no tests');
        });
    });

    describe('server operations', function(){
        var server;
        before(function () {
          server = createServer({
            opts:'this opts'
          });
        });
        it('should work ok', function(done){
            request(server)
            .get('/example/tabulator')
            .expect(200, "works ok!")
            .end(function(err, res){
                if (err) return done(err);
                assert.equal(internalCounter,1);
                done()
            });
        });
    });
});


function createServer(opts, fn) {
    var _serve = tabulator(opts);
    return http.createServer(function (req, res) {
        fn && fn(req, res);
        _serve(req, res, function (err) {
            res.statusCode = err ? (err.status || 500) : 404;
            res.end(err ? err.stack : 'sorry!');
        });
    });
}
